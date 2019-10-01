from django.contrib import admin

from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("name", "institution", "user", "balance")
    list_filter = ("user",)
    search_fields = ("name", "institution")
