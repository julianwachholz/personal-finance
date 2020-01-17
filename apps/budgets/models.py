from django.contrib.postgres.fields import CICharField
from django.db import models
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator
from moneyed import Money


class Budget(models.Model):
    """
    A budget specifies time constrained transaction limits or goals.

    """

    PERIOD_WEEK = "weekly"
    PERIOD_MONTH = "monthly"
    PERIOD_QUARTER = "quarterly"
    PERIOD_YEAR = "yearly"
    PERIOD_CHOICES = (
        (PERIOD_WEEK, _("weekly")),
        (PERIOD_MONTH, _("monthly")),
        (PERIOD_QUARTER, _("quarterly")),
        (PERIOD_YEAR, _("yearly")),
    )

    name = CICharField(max_length=100)
    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="budgets"
    )
    pos = models.PositiveSmallIntegerField(default=0, db_index=True)

    period = models.CharField(
        verbose_name=_("time period"),
        max_length=100,
        choices=PERIOD_CHOICES,
        default=PERIOD_MONTH,
    )

    is_blacklist = models.BooleanField(
        verbose_name=_("blacklist categories?"),
        default=False,
        help_text=_("Exclude selected categories instead of including them."),
    )

    categories = models.ManyToManyField(to="categories.Category", blank=True)

    target = MoneyField(
        verbose_name=_("target amount"),
        max_digits=10,
        decimal_places=2,
        validators=[MinMoneyValidator(0)],
    )

    class Meta:
        verbose_name = _("budget")
        verbose_name_plural = _("budgets")
        ordering = ("user", "pos", "name")
        unique_together = (("user", "name"),)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<Budget user={self.user!r} name={self.name!r}>"
