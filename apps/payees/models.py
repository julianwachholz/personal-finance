from django.db import models
from django.utils.translation import ugettext_lazy as _


class Payee(models.Model):
    """
    A payee is a recipient for transactions.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("payee")
        verbose_name_plural = _("payees")

    def __str__(self):
        return self.name
