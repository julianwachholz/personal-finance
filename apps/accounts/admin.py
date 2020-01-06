from django.contrib import admin

from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("__str__", "icon", "institution", "user", "balance_currency", "pos")
    list_filter = ("user",)
    search_fields = ("name", "institution")
    fieldsets = (
        (None, {"fields": ("name", "institution", "user")}),
        ("Details", {"fields": ("initial_date", "icon", "pos")}),
        ("Balance", {"fields": ("balance",), "classes": ("collapse",)}),
    )
