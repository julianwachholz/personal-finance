from django.contrib import admin

from .models import Payee


@admin.register(Payee)
class PayeeAdmin(admin.ModelAdmin):
    list_display = ("name", "user")
    search_fields = ("name",)
    autocomplete_fields = ("user",)
