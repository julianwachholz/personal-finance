from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "datetime",
        "amount",
        "text",
        "user",
        "account",
        "payee",
        "category",
    )

    fieldsets = (
        (None, {"fields": ("datetime", "amount", "account", "category")}),
        ("Detail", {"fields": ("text", "payee", "tags")}),
        ("Info", {"fields": ("user", "reference")}),
    )

    autocomplete_fields = ("account", "category", "payee", "tags", "user")
