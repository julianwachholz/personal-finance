from django.db import models
from django.utils.translation import ugettext_lazy as _


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

    name = models.CharField(verbose_name=_("name"), max_length=100)
    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)
    pos = models.PositiveSmallIntegerField(default=0, db_index=True)

    period = models.CharField(
        verbose_name=_("time period"),
        max_length=100,
        choices=PERIOD_CHOICES,
        default=PERIOD_MONTH,
    )

    category_whitelist = models.BooleanField(_("include categories"), default=True)

    include_categories = []
    exclude_categories = []

    class Meta:
        verbose_name = _("budget")
        verbose_name_plural = _("budgets")
        ordering = ("user", "pos", "name")

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"<Budget user={self.user!r} name={self.name!r}>"
