from django.contrib import admin

from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("__str__", "icon", "institution", "user", "balance", "pos")
    list_filter = ("user",)
    search_fields = ("name", "institution")
