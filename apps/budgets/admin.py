from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from .models import Budget


class BudgetForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = "__all__"

    def clean(self):
        user = self.cleaned_data["user"]
        categories = self.cleaned_data["categories"]

        for category in categories:
            if category.user != user:
                raise ValidationError(
                    {
                        "categories": f'Category "{category}" does not belong to the same user.'
                    }
                )
        return self.cleaned_data


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "period", "target")
    list_filter = ("user",)
    form = BudgetForm
    search_fields = ("name",)
    autocomplete_fields = ("user",)
    filter_horizontal = ("categories",)
