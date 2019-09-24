from django.db import models
from django.utils.translation import ugettext_lazy as _
from django_countries.fields import CountryField
from djmoney.models.fields import CurrencyField


class Tax(models.Model):
    """
    A tax rate for a jurisdiction and level.
    """

    LEVEL_FEDERAL = "federal"
    LEVEL_STATE = "state"
    LEVEL_COUNTY = "county"
    LEVEL_CHOICES = (
        (LEVEL_FEDERAL, _("federal")),
        (LEVEL_STATE, _("state")),
        (LEVEL_COUNTY, _("county")),
    )

    TYPE_INCOME = "income"
    TYPE_WEALTH = "wealth"
    TYPE_CAPITAL_GAINS = "capital gains"
    TYPE_WITHHOLDING = "withholding"
    TYPE_OTHER = "other"
    TYPE_CHOICES = (
        (TYPE_INCOME, _("income tax")),
        (TYPE_WEALTH, _("wealth tax")),
        (TYPE_CAPITAL_GAINS, _("capital gains tax")),
        (TYPE_WITHHOLDING, _("withholding tax")),
        (TYPE_OTHER, _("other tax")),
    )

    country = CountryField()

    currency = CurrencyField()

    level = models.CharField(
        verbose_name=_("tax level"), max_length=50, choices=LEVEL_CHOICES
    )

    state = models.CharField(
        verbose_name=_("state / region"),
        max_length=50,
        help_text=_("State or region this tax rate is valid in."),
        blank=True,
    )

    key = models.CharField(verbose_name=_("identifier"), max_length=100)
    name = models.CharField(verbose_name=_("name"), max_length=100)
    tariff = models.CharField(
        verbose_name=_("tariff"),
        max_length=100,
        blank=True,
        help_text=_("Tariff target demographic, e.g. single households."),
    )

    valid_year = models.PositiveSmallIntegerField(verbose_name=_("valid year"))

    tax_type = models.CharField(
        verbose_name=_("tax type"), max_length=100, choices=TYPE_CHOICES
    )

    class Meta:
        verbose_name = _("tax")
        verbose_name_plural = _("taxes")
        ordering = ("country", "level", "tax_type")

    def __str__(self):
        return self.name


class TaxRate(models.Model):
    """
    A tax rate level for a tax.
    """

    tax = models.ForeignKey(to=Tax, on_delete=models.CASCADE, related_name="rates")
    bracket = models.DecimalField(
        verbose_name=_("bracket"), max_digits=10, decimal_places=2
    )
    amount = models.DecimalField(
        verbose_name=_("amount"), max_digits=10, decimal_places=2
    )
    increment = models.DecimalField(
        verbose_name=_("increment"), max_digits=10, decimal_places=2
    )
    increment_amount = models.DecimalField(
        verbose_name=_("increment amount"), max_digits=10, decimal_places=2
    )

    class Meta:
        verbose_name = _("tax level")
        verbose_name_plural = _("tax levels")
        ordering = ("bracket",)


class TaxDeduction(models.Model):
    """
    A possible tax deduction.

    """

    tax = models.ForeignKey(to=Tax, on_delete=models.CASCADE, related_name="deductions")
    key = models.CharField(verbose_name=_("identifier"), max_length=100)
    name = models.CharField(verbose_name=_("name"), max_length=100)
    description = models.CharField(
        verbose_name=_("description"), max_length=300, blank=True
    )
    min_amount = models.DecimalField(
        verbose_name=_("min. amount"),
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    max_amount = models.DecimalField(
        verbose_name=_("max. amount"),
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    fix_amount = models.DecimalField(
        verbose_name=_("fixed amount"),
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
    )
    has_multiplier = models.BooleanField(
        verbose_name=_("has multiplier?"),
        default=False,
        help_text=_("Multiply the fixed amount by a certain multiplier."),
    )

    class Meta:
        verbose_name = _("tax deduction")
        verbose_name_plural = _("tax deductions")
