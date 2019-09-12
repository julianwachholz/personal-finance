from django.db import models
from django.utils.translation import ugettext_lazy as _


class Budget(models.Model):
    """
    A budget with money in and outflow.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("budget")
        verbose_name_plural = _("budgets")
        ordering = ("name", "user")

    def __str__(self):
        return self.name
