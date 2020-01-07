from django.db import models, transaction
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


def create_default_categories(user):
    categories = [
        (
            {"name": "Food", "icon": "🍽️"},
            [
                ({"name": "Lunch"},),
                ({"name": "Groceries"},),
                ({"name": "Fast Food", "icon": "🍔"},),
                ({"name": "Restaurants", "icon": "🍷"},),
            ],
        ),
        (
            {"name": "Transportation", "icon": "🚗"},
            [
                ({"name": "Car", "icon": ""},),
                ({"name": "Fuel", "icon": "⛽"},),
                ({"name": "Parking", "icon": "🅿️"},),
                ({"name": "Public Transport", "icon": "🚇"},),
                ({"name": "Taxi", "icon": "🚕"},),
            ],
        ),
        (
            {"name": "Home", "icon": "🏠"},
            [({"name": "Rent"},), ({"name": "Furniture"},)],
        ),
        ({"name": "Communication", "icon": "📱"},),
        (
            {"name": "Personal", "icon": "💆"},
            [
                ({"name": "Going Out", "icon": "🍻"},),
                ({"name": "Entertainment", "icon": "📽️"},),
                ({"name": "Shopping", "icon": "🛍️"},),
                ({"name": "Vacation", "icon": "⛱️"},),
            ],
        ),
        ({"name": "Health", "icon": "🏥"},),
        ({"name": "Taxes", "icon": "🧾"},),
        ({"name": "Income", "icon": "💰"},),
    ]

    with transaction.atomic():
        _create_category_tree(user, categories)


def _create_category_tree(user, categories, parent=None):
    for kwargs, *children in categories:
        category = Category(user=user, **kwargs)
        category.insert_at(parent, position="last-child", save=True)
        if category.name == "Income":
            user.settings.default_credit_category = category
            user.settings.save()

        if children:
            _create_category_tree(user, children[0], parent=category)
