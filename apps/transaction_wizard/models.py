import os
from datetime import datetime
from decimal import Decimal

import magic
from django.contrib.postgres.fields import JSONField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _
from tablib import detect_format, import_set


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
        return self.dataset.headers


class ImportConfig(models.Model):
    """
    Configuration for an import run.
    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    file_type = models.CharField(verbose_name=_("file type"), max_length=100)

    last_use = models.DateTimeField(null=True)

    class Meta:
        verbose_name = _("import config")
        verbose_name_plural = _("import configs")

    def __str__(self):
        return f"{self.file_type} Import Config"


class ColumnMapping(models.Model):
    """Map a file header to a model attribute."""

    DATETIME = "datetime"
    ACCOUNT = "account"
    AMOUNT = "amount"
    CATEGORY = "category"
    TEXT = "text"
    PAYEE = "payee"
    TAGS = "tags"
    REFERENCE = "reference"

    TARGET_CHOICES = (
        # required fields
        (DATETIME, "Date / time"),
        (ACCOUNT, "Account"),
        (AMOUNT, "Amount"),
        # optional fields
        (CATEGORY, "Category"),
        (TEXT, "Text"),
        (PAYEE, "Payee"),
        (TAGS, "Tags"),
        (REFERENCE, "Reference"),
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
    """
    options are parameters to help the parser for this column.

    :format string: to parse a datetime or decimal
    :value any: a fixed value to set in this column
    """

    class Meta:
        verbose_name = _("column mapping")
        verbose_name_plural = _("column mappings")
        unique_together = (("config", "target"),)

    def clean(self):
        if self.is_sourced and not self.source:
            raise ValidationError({"source": "A source is required"})
