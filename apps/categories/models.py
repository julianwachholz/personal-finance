from django.db import models
from django.utils.translation import ugettext_lazy as _


class Category(models.Model):
    """
    A category classifies budgets or transactions.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    icon = models.CharField(verbose_name=_("icon"), max_length=100)

    pos = models.PositiveSmallIntegerField(default=0, db_index=True)

    parent = models.ForeignKey(to="self", on_delete=models.CASCADE)

    class Meta:
        verbose_name = _("category")
        verbose_name_plural = _("categories")
        ordering = ("user", "pos", "name")

    def __str__(self):
        return self.name
