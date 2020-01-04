from colorfield.fields import ColorField
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
        verbose_name=_("parent"),
        to="self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    color = models.CharField(verbose_name=_("color"), max_length=100, blank=True)

    class Meta:
        verbose_name = _("category")
        verbose_name_plural = _("categories")

    class MPTTMeta:
        order_insertion_by = ["name"]

    def __str__(self):
        return f"{self.get_icon()} {self.name}"

    def __repr__(self):
        return f"<Category(user={self.user!r}, name={str(self)!r}, parent={self.parent!r})>"

    def get_icon(self):
        if not self.icon and self.parent:
            return self.parent.icon
        return self.icon

    def get_color(self):
        if not self.color and self.parent:
            return self.parent.color
        return self.color
