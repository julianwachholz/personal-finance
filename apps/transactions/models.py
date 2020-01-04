from dateutil.rrule import FR, MO, SA, SU, TH, TU, WE
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from mptt.fields import TreeForeignKey


class AbstractTransaction(models.Model):
    """
    Abstract base transaction.

    """

    account = models.ForeignKey(
        to="accounts.Account", on_delete=models.CASCADE, related_name="%(class)ss"
    )

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    category = TreeForeignKey(
        to="categories.Category",
        on_delete=models.SET_NULL,
        related_name="%(class)ss",
        blank=True,
        null=True,
    )

    payee = models.ForeignKey(
        to="payees.Payee",
        on_delete=models.SET_NULL,
        related_name="%(class)ss",
        blank=True,
        null=True,
    )

    tags = models.ManyToManyField(to="tags.Tag", blank=True)

    amount = MoneyField(verbose_name=_("amount"), max_digits=10, decimal_places=2)

    text = models.CharField(verbose_name=_("text"), max_length=500, blank=True)

    reference = models.CharField(
        verbose_name=_("reference"), max_length=500, blank=True
    )

    related = models.ForeignKey(
        to="self",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text=_("Reverse transaction to a transfer."),
    )

    class Meta:
        abstract = True

    def clean(self):
        if self.amount_currency != self.account.balance_currency:
            self.amount_currency = self.account.balance_currency

    def save(self, *args, **kwargs):
        self.amount_currency = self.account.balance_currency
        if not self.category and self.payee:
            self.category = self.payee.default_category
        super().save(*args, **kwargs)
        if self.related and self.related.related != self:
            self.related.related = self
            self.related.save()

    def is_credit(self):
        return self.amount > 0

    def is_debit(self):
        return not self.is_credit()

    def is_transfer(self):
        return self.related is not None


class Transaction(AbstractTransaction):
    """
    A transaction on an account.

    """

    datetime = models.DateTimeField(verbose_name=_("date / time"), default=now)

    is_initial = models.BooleanField(verbose_name=_("initial balance?"), default=False)

    class Meta:
        verbose_name = _("transaction")
        verbose_name_plural = _("transactions")
        ordering = ("-datetime",)

    def __str__(self):
        return f"{self.datetime.date()} - {self.text}: {self.amount}"


class PlannedTransaction(AbstractTransaction):
    """
    A planned transaction that can repeat.

    """

    start = models.DateTimeField(verbose_name=_("start date / time"))
    end = models.DateTimeField(verbose_name=_("end date / time"), blank=True, null=True)

    is_repeating = models.BooleanField(verbose_name=_("is repeating?"), default=False)


class Rule(models.Model):
    """
    A recurrence rule.

    """

    FREQUENCY_DAILY = "DAILY"
    FREQUENCY_WEEKLY = "WEEKLY"
    FREQUENCY_MONTHLY = "MONTHLY"
    FREQUENCY_YEARLY = "YEARLY"
    FREQUENCY_CHOICES = (
        (FREQUENCY_DAILY, _("daily")),
        (FREQUENCY_WEEKLY, _("weekly")),
        (FREQUENCY_MONTHLY, _("monthly")),
        (FREQUENCY_YEARLY, _("yearly")),
    )

    frequency = models.CharField(
        verbose_name=_("frequency"), max_length=10, choices=FREQUENCY_CHOICES
    )
    interval = models.PositiveIntegerField(verbose_name=_("interval"), default=1)

    class Meta:
        verbose_name = _("rule")
        verbose_name_plural = _("rules")
