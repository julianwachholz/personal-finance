from rest_framework import serializers

from .models import Account


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Account
        fields = [
            "pk",
            "name",
            "institution",
            "balance",
            "balance_currency",
            "icon",
            "pos",
        ]
