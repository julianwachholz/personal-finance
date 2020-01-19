from django.contrib import admin

from .models import ImportFile


@admin.register(ImportFile)
class ImportFileAdmin(admin.ModelAdmin):
    list_display = ("file", "type", "user", "datetime")
