import os
import re
from decimal import Decimal
from functools import lru_cache

import magic
from dateutil.parser import parse
from dateutil.utils import default_tzinfo
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import JSONField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.functional import cached_property
from django.utils.timezone import utc
from django.utils.translation import ugettext_lazy as _
from django_better_admin_arrayfield.models.fields import ArrayField
from tablib import detect_format, import_set

from apps.accounts.models import Account
from apps.payees.models import Payee
from apps.transactions.models import Transaction


def upload_path(instance, filename):
    return f"import/{instance.user.id}/{filename}"


class ImportFile(models.Model):
    """
    A file to be imported by a user.
    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    file = models.FileField(upload_to=upload_path)

    type = models.CharField(max_length=100, editable=False)

    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("import file")
        verbose_name_plural = _("import files")
        ordering = ("user", "-datetime")

    def __str__(self):
        return os.path.basename(self.file.name)

    def get_type(self):
        mime = magic.from_buffer(self.file.read(1024), mime=True)
        if mime == "text/plain" and self.file.name.endswith(".csv"):
            mime = "text/csv"
        return mime

    def save(self, **kwargs):
        self.type = self.get_type()
        return super().save(**kwargs)

    @cached_property
    def dataset(self):
        with self.file.open("r") as fh:
            fmt = detect_format(fh)
            data = import_set(fh, format=fmt)
        return data

    @property
    def headers(self):
        return [header.strip() for header in self.dataset.headers]

    def matching_configs(self):
        """Get matching import configs."""
        configs = ImportConfig.find_matching_headers(
            headers=self.headers, user=self.user
        )
        return configs


def strip_keys(record):
    """Strip the keys of whitespace in a dict."""
    return {key.strip(): value for key, value in record.items()}


class ImportConfig(models.Model):
    """
    Configuration for an import run.
    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    file_type = models.CharField(verbose_name=_("file type"), max_length=100)

    last_use = models.DateTimeField(null=True)

    # auto_reconcile = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("import config")
        verbose_name_plural = _("import configs")

    def __str__(self):
        return f"{self.file_type} Import Config"

    @classmethod
    def find_matching_headers(cls, headers, user):
        for config in cls.objects.filter(user=user):
            mappings = config.mappings.filter(is_sourced=True)
            if all(mapping.source in headers for mapping in mappings):
                yield config

    def _map_record(self, record):
        record = strip_keys(record)
        kwargs = {
            mapping.serializer_target: mapping.get_value(record)
            for mapping in self.mappings.all()
        }

        if "account_id" in kwargs:
            account = _get_account_by_pk(kwargs["account_id"])
            kwargs["amount_currency"] = account.balance_currency

        if "category_id" not in kwargs and kwargs.get("payee_id"):
            payee = _get_payee_by_pk(kwargs["payee_id"])
            if payee.default_category:
                kwargs["category_id"] = payee.default_category_id

        if "reference" in kwargs:
            # Update existing transaction with the same reference instead
            try:
                tx = Transaction.objects.get(
                    user=self.user, reference=kwargs["reference"].strip()
                )
                for key, value in kwargs.items():
                    if getattr(tx, key, None) is None:
                        setattr(tx, key, value)
                return tx
            except Transaction.DoesNotExist:
                pass

        # if self.auto_reconcile:
        #     try:
        #         tx = Transaction.objects.get(
        #             user=self.user,
        #             datetime__date=kwargs["datetime"].date(),
        #             amount=kwargs["amount"],
        #             account_id=kwargs["account_id"],
        #         )
        #         tx.is_reconciled = True
        #     except Transaction.DoesNotExist:
        #         pass

        return Transaction(user=self.user, **kwargs)

    def get_preview(self, dataset):
        transactions = map(self._map_record, dataset.dict[:10])
        return transactions

    def get_unmapped_values(self, dataset):
        """Get a collection of unmapped values."""
        return {
            mapping.target: mapping.get_unmapped_values(dataset)
            for mapping in self.mappings.all()
            if mapping.is_sourced and mapping.target in {"account", "payee", "category"}
        }

    def import_dataset(self, dataset):
        """
        Import a dataset.

        """
        reference_mapping = self.mappings.filter(target=ColumnMapping.REFERENCE).first()

        if not reference_mapping:
            # import blindly
            object_list = list(map(self._map_record, dataset.dict))
            Transaction.objects.bulk_create(object_list)
            return len(object_list)

        count = 0
        for tx in map(self._map_record, dataset.dict):
            tx.save()
            count += 1
        return count


@lru_cache(32)
def _get_account_by_pk(pk):
    return Account.objects.get(pk=pk)


@lru_cache(128)
def _get_payee_by_pk(pk):
    return Payee.objects.get(pk=pk)


class ColumnMapping(models.Model):
    """Map a file header to a model attribute."""

    DATETIME = "datetime"
    ACCOUNT = "account"
    AMOUNT = "amount"
    PAYEE = "payee"
    CATEGORY = "category"
    TEXT = "text"
    TAGS = "tags"
    REFERENCE = "reference"

    TARGET_CHOICES = (
        # required fields
        (DATETIME, _("Date / time")),
        (ACCOUNT, _("Account")),
        (AMOUNT, _("Amount")),
        # optional fields
        (PAYEE, _("Payee")),
        (CATEGORY, _("Category")),
        (TEXT, _("Text")),
        (TAGS, _("Tags")),
        (REFERENCE, _("Reference")),
    )

    config = models.ForeignKey(
        to=ImportConfig, on_delete=models.CASCADE, related_name="mappings"
    )

    target = models.CharField(max_length=255, choices=TARGET_CHOICES)

    is_sourced = models.BooleanField(
        verbose_name=_("get value from source file?"), default=True
    )

    source = models.CharField(max_length=255, blank=True)

    options = JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = _("column mapping")
        verbose_name_plural = _("column mappings")
        unique_together = (("config", "target"),)

    def __str__(self):
        return self.get_target_display()

    def clean(self):
        if self.is_sourced and not self.source:
            raise ValidationError({"source": "A source is required"})

    @property
    def serializer_target(self):
        if self.target in ("account", "payee", "category"):
            return f"{self.target}_id"
        return self.target

    def get_unmapped_values(self, dataset):
        if not self.is_sourced or self.target not in {"account", "payee", "category"}:
            return

        def stripped_records(ds):
            for r in ds:
                yield strip_keys(r)

        source_values = {
            record[self.source]: None
            for record in stripped_records(dataset.dict)
            if self.get_value(record) is None
        }
        return source_values.keys()

    def get_value(self, record):
        value = None
        if self.is_sourced:
            value = record[self.source]
        else:
            value = self.options.get("value")

        getter = getattr(self, f"_get_{self.target}_from_value", None)

        if getter is not None:
            value = getter(value)
        return value

    def _get_datetime_from_value(self, value):
        date = parse(
            value,
            yearfirst=self.options.get("yearfirst", False),
            dayfirst=self.options.get("dayfirst", True),
        )
        date = default_tzinfo(date, utc)
        return date

    @cached_property
    def _find_object_id(self):
        @lru_cache(512)
        def __find_object_id(model, user, value):
            return _find_object_id(model, user, value)

        return __find_object_id

    def find_object_id(self, model, value):
        return self._find_object_id(model, self.config.user, value)

    def _get_account_from_value(self, value):
        if type(value) == int:
            return value
        return self.find_object_id("accounts.account", value)

    def _get_amount_from_value(self, value):
        decimal_separator = self.options.get("decimal_separator", ".")
        cleaned = re.compile(f"[^-0-9{re.escape(decimal_separator)}]").sub("", value)
        amount = Decimal(cleaned.replace(decimal_separator, "."))
        if self.options.get("invert_value", False):
            amount *= -1
        return amount

    def _get_payee_from_value(self, value):
        return self.find_object_id("payees.payee", value)

    def _get_category_from_value(self, value):
        return self.find_object_id("categories.category", value)

    def _get_tags_from_value(self, value):
        # TODO
        pass


@lru_cache(10)
def _content_type_for(name):
    app_label, model = name.split(".")
    return ContentType.objects.get(app_label=app_label, model=model)


def _find_object_id(model, user, value):
    content_type = _content_type_for(model)
    try:
        mapping = ValueMapping.objects.get(
            user=user, content_type=content_type, values__contains=[value]
        )
        return mapping.object_id
    except ValueMapping.DoesNotExist:
        pass


class ValueMappingManager(models.Manager):
    def get_by_natural_key(self, content_type, object_id):
        return self.get(content_type=content_type, object_id=object_id)


class ValueMapping(models.Model):

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    content_type = models.ForeignKey(to=ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    values = ArrayField(models.CharField(max_length=200))

    objects = ValueMappingManager()

    class Meta:
        verbose_name = "value mapping"
        verbose_name_plural = "value mappings"
        unique_together = ("content_type", "object_id")

    def __str__(self):
        return str(self.content_object)

    def clean(self):
        assert self.user == self.content_object.user

    def save(self, **kwargs):
        # unique values
        self.values = list(set(self.values))
        return super().save(**kwargs)

    def natural_key(self):
        return (self.content_type, self.object_id)
