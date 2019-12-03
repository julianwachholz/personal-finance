from django.db import models
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField


class Account(models.Model):
    """
    A financial account holds transactions.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    institution = models.CharField(
        verbose_name=_("institution"), max_length=100, blank=True
    )

    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="accounts"
    )

    balance = MoneyField(
        verbose_name=_("balance"), max_digits=10, decimal_places=2, default=0
    )

    icon = models.CharField(verbose_name=_("icon"), max_length=100, blank=True)

    pos = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        verbose_name = _("account")
        verbose_name_plural = _("accounts")
        ordering = ("user", "pos", "name")

    def __str__(self):
        return f"{self.icon} {self.name}"

    def __repr__(self):
        return f"<Account(user={self.user!r}, name={self.name!r}, institution={self.institution!r}, balance={self.balance!r})>"
