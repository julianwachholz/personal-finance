from rest_framework import serializers

from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    group_separator = serializers.CharField(trim_whitespace=False)

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
