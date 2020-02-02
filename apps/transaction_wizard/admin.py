from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import widgets
from django.forms.models import BaseInlineFormSet
from django_better_admin_arrayfield.admin.mixins import DynamicArrayMixin

from .models import ColumnMapping, ImportConfig, ImportFile, ValueMapping


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


class ColumnMappingForm(forms.ModelForm):
    source = forms.CharField(
        strip=False, required=False, widget=widgets.Input(attrs={"class": "vTextField"})
    )

    class Meta:
        model = ColumnMapping
        fields = "__all__"


class ColumnMappingInline(admin.StackedInline):
    model = ColumnMapping
    extra = 0
    formset = ColumnMappingFormSet
    form = ColumnMappingForm


@admin.register(ImportConfig)
class ImportConfigAdmin(admin.ModelAdmin):
    list_display = ("user", "file_type", "last_use")
    inlines = [ColumnMappingInline]


@admin.register(ValueMapping)
class ValueMappingAdmin(admin.ModelAdmin, DynamicArrayMixin):
    list_display = ("user", "content_type", "object_id")
