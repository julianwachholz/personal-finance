from django.contrib import admin

from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_filter = ("user",)
    list_display = ("datetime", "text", "user", "account", "payee", "category")

    fieldsets = (
        (None, {"fields": ("datetime", "account", "category")}),
        ("Detail", {"fields": ("text", "related", "payee", "tags")}),
        ("Info", {"fields": ("user", "reference")}),
        ("Amount", {"fields": ("amount",), "classes": ("collapse",)}),
    )

    search_fields = ("reference__iexact", "text")

    autocomplete_fields = ("account", "category", "payee", "tags", "user", "related")
