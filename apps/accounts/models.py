from django.db import models
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField


class Account(models.Model):
    """
    A financial account holds transactions.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    institution = models.CharField(verbose_name=_("institution"), max_length=100)

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    balance = MoneyField(
        max_digits=10, decimal_places=2, currency_field_name="currency"
    )

    icon = models.CharField(verbose_name=_("icon"), max_length=100)

    pos = models.PositiveSmallIntegerField(default=0, index=True)

    class Meta:
        verbose_name = _("account")
        verbose_name_plural = _("accounts")
        ordering = ("user", "institution", "name")

    def __str__(self):
        return self.name
