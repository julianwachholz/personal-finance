from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import CurrencyField


class Settings(models.Model):
    """
    Settings hold profile options for a user.

    """

    user = models.OneToOneField(to="auth.User", on_delete=models.CASCADE)

    default_currency = CurrencyField()

    default_debit_account = models.ForeignKey(
        to="accounts.Account",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="+",
    )

    default_credit_account = models.ForeignKey(
        to="accounts.Account",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="+",
    )

    decimal_separator = models.CharField(
        verbose_name=_("decimal separator"), max_length=3, default="."
    )
    group_separator = models.CharField(
        verbose_name=_("group / thousand separator"), max_length=3, default=" "
    )
    date_format = models.CharField(
        verbose_name=_("date format"), max_length=100, blank=True
    )

    class Meta:
        verbose_name = _("settings")
        verbose_name_plural = _("settings")

    def __str__(self):
        return f"Settings for {self.user}"

    def clean(self):
        errors = {}
        if (
            self.default_credit_account
            and self.user != self.default_credit_account.user
        ):
            errors["default_credit_account"] = _("Account doesn't belong to same user.")
        if self.default_debit_account and self.user != self.default_debit_account.user:
            errors["default_debit_account"] = _("Account doesn't belong to same user.")

        if errors:
            raise ValidationError(errors)
