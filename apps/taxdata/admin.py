from django.contrib import admin

from .models import Tax, TaxDeduction, TaxRate


class TaxRateInline(admin.TabularInline):
    model = TaxRate
    extra = 0


class TaxDeductionInline(admin.StackedInline):
    model = TaxDeduction
    extra = 0


@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ("name", "tax_type", "country", "level", "state")
    list_filter = ("country", "tax_type")
    inlines = (TaxRateInline, TaxDeductionInline)
