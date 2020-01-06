from django import forms
from django.contrib import admin
from django.forms import widgets

from .models import Settings


class SettingsForm(forms.ModelForm):

    group_separator = forms.CharField(
        strip=False, widget=widgets.Input(attrs={"class": "vTextField"})
    )

    class Meta:
        model = Settings
        fields = "__all__"


@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_filter = ("user",)
    form = SettingsForm
    autocomplete_fields = ("user", "default_debit_account", "default_credit_account")
