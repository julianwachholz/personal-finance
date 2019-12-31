from rest_framework import serializers

from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = (
            "default_currency",
            "default_debit_account",
            "default_credit_account",
            "date_format",
        )
