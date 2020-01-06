from django.contrib import admin

from .models import Payee


@admin.register(Payee)
class PayeeAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "default_category", "user")
    list_filter = ("user",)
    search_fields = ("name",)
    autocomplete_fields = ("user",)
