from django.contrib import admin

from .models import Tax, TaxBase, TaxDeduction, TaxRate


class TaxRateInline(admin.TabularInline):
    model = TaxRate
    extra = 0


class TaxDeductionInline(admin.StackedInline):
    model = TaxDeduction
    extra = 0


@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ("name", "valid_from", "valid_until", "tariff", "country", "level", "state", "tax_type")
    list_filter = (("country", admin.AllValuesFieldListFilter), "tax_type")
    inlines = (TaxRateInline, TaxDeductionInline)


@admin.register(TaxBase)
class TaxBaseAdmin(admin.ModelAdmin):
    list_display = ("name", "variant", "country", "state", "valid_from", "valid_until", "percentage")
    list_filter = (("country", admin.AllValuesFieldListFilter), "state", "variant")
    search_fields = ("name",)
