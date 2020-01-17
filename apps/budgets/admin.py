from django.contrib import admin

from .models import Budget


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "period", "target")
    list_filter = ("user",)
    search_fields = ("name",)
    autocomplete_fields = ("user",)
    filter_horizontal = ("categories",)
