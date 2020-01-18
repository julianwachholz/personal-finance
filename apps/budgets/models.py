from decimal import Decimal

from django.contrib.postgres.fields import CICharField
from django.db import models
from django.utils.functional import cached_property
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField
from djmoney.models.validators import MinMoneyValidator

from apps.transactions.models import Transaction


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
        validators=[
            MinMoneyValidator(Decimal("0.01"), message=_("Must be more than zero"))
        ],
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

    def _period_filter(self):
        """Get kwargs to filter transactions by the current period."""
        date = now()
        kwargs = {"datetime__year": date.year}

        if self.period == self.PERIOD_WEEK:
            kwargs["datetime__week"] = date.isocalendar()[1]
        if self.period == self.PERIOD_MONTH:
            kwargs["datetime__month"] = date.month
        if self.period == self.PERIOD_QUARTER:
            kwargs["datetime__quarter"] = date.month // 4 + 1
        # no additional kwargs needed for PERIOD_YEAR
        return kwargs

    def _category_filter(self):
        return {"category__in": self.categories.all()}

    @cached_property
    def current_amount(self):
        """Current amount for the active period."""
        qs = Transaction.objects.filter(
            user=self.user,
            # ensure same currency
            amount_currency=self.target_currency,
            # ignore initial balances and transfers
            is_initial=False,
            related__isnull=True,
        )

        # filter by datetime period
        qs = qs.filter(**self._period_filter())

        # filter by categories
        if self.is_blacklist:
            qs = qs.exclude(**self._category_filter())
        else:
            qs = qs.filter(**self._category_filter())

        aggregate = qs.aggregate(sum=models.Sum("amount"))
        return aggregate["sum"] or Decimal(0)

    @property
    def remaining_amount(self):
        """Remaining amount for the active period."""
        return self.target.amount + self.current_amount

    @property
    def percentage(self):
        """Current percentage for the active period."""
        return round(self.current_amount / self.target.amount * -100)
