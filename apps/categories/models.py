import json
import os

from django.db import models, transaction
from django.utils.translation import get_language
from mptt.models import MPTTModel, TreeForeignKey


class Category(MPTTModel):
    """
    A category classifies budgets or transactions.

    """

    name = models.CharField(verbose_name="name", max_length=100)

    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="categories"
    )

    icon = models.CharField(verbose_name="icon", max_length=100, blank=True)

    parent = TreeForeignKey(
        verbose_name="parent",
        to="self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    color = models.CharField(verbose_name="color", max_length=100, blank=True)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"

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


def create_default_categories(user):
    language = get_language()

    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/default_categories_{language}.json"
        )
    ) as f:
        categories = json.load(f)

    with transaction.atomic():
        _create_category_tree(user, categories)


def _create_category_tree(user, categories, parent=None):
    for kwargs, *children in categories:
        category = Category(user=user, **kwargs)
        category.insert_at(parent, position="last-child", save=True)

        if category.name in {"Salary", "Salär"}:
            user.settings.default_credit_category = category
            user.settings.save()

        if children:
            _create_category_tree(user, children[0], parent=category)
