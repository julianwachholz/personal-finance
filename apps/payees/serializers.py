from rest_framework import serializers

from .models import Payee


class PayeeSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")

    class Meta:
        model = Payee
        fields = ["pk", "name", "label", "type"]
