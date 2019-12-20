from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.HyperlinkedModelSerializer):

    label = serializers.CharField(read_only=True, source="__str__")

    class Meta:
        model = Account
        fields = (
            "pk",
            "label",
            "name",
            "institution",
            "balance",
            "balance_currency",
            "icon",
            "pos",
        )
