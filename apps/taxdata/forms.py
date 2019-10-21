from django import forms

from .models import Tax


class TaxForm(forms.Form):
    net_income = forms.IntegerField(
        min_value=0, widget=forms.NumberInput(attrs={"step": 100})
    )

    tax = forms.ModelChoiceField(queryset=Tax.objects.all())

    deduction_commute = forms.IntegerField(min_value=0, initial=0)
    deduction_meals = forms.IntegerField(min_value=0, initial=0)
    deduction_insurance = forms.IntegerField(min_value=0, initial=0)
    deduction_education = forms.IntegerField(min_value=0, initial=500)
    deduction_work = forms.IntegerField(min_value=2000, max_value=4000, initial=2000)
    deduction_third_pillar = forms.IntegerField(min_value=0, max_value=6826, initial=0)
