from django.db import models
from django.utils.translation import ugettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """
    A category classifies budgets or transactions.

    """

    name = models.CharField(verbose_name=_("name"), max_length=100)

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    icon = models.CharField(verbose_name=_("icon"), max_length=100, blank=True)

    parent = TreeForeignKey(
        to="self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    class Meta:
        verbose_name = _("category")
        verbose_name_plural = _("categories")
        ordering = ("user", "name")

    class MPTTMeta:
        order_insertion_by = ["name"]

    def __str__(self):
        return self.name
