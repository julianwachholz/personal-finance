from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms.models import BaseInlineFormSet

from .models import ColumnMapping, ImportConfig, ImportFile


@admin.register(ImportFile)
class ImportFileAdmin(admin.ModelAdmin):
    list_display = ("__str__", "file", "type", "user", "datetime")

    readonly_fields = ("type", "datetime")


class ColumnMappingFormSet(BaseInlineFormSet):
    def clean(self):
        mapped = set()

        for form in self.forms:
            try:
                mapped.add(form.cleaned_data["target"])
            except AttributeError:
                pass

        if not ({"datetime", "amount", "account"} <= mapped):
            raise ValidationError(
                "At least datetime, amount and account must be mapped."
            )


class ColumnMappingInline(admin.StackedInline):
    model = ColumnMapping
    extra = 0
    formset = ColumnMappingFormSet


@admin.register(ImportConfig)
class ImportConfigAdmin(admin.ModelAdmin):
    list_display = ("user", "file_type", "last_use")
    inlines = [ColumnMappingInline]
