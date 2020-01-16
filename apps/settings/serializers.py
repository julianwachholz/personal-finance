from rest_framework import serializers

from apps.accounts.models import Account
from apps.categories.models import Category
from util.serializers import UserPKWithLabelField

from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    group_separator = serializers.CharField(trim_whitespace=False)
    default_debit_account = UserPKWithLabelField(queryset=Account.objects)
    default_credit_account = UserPKWithLabelField(queryset=Account.objects)
    default_credit_category = UserPKWithLabelField(queryset=Category.objects)

    class Meta:
        model = Settings
        fields = (
            "default_currency",
            "default_debit_account",
            "default_credit_account",
            "default_credit_category",
            "decimal_separator",
            "group_separator",
            "use_colors",
            "date_format",
        )
