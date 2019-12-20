from rest_framework import serializers

from apps.accounts.models import Account
from apps.categories.models import Category
from apps.tags.models import Tag

from .models import Transaction


class AccountSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__")

    class Meta:
        model = Account
        fields = ("pk", "label")


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__")

    class Meta:
        model = Category
        fields = ("pk", "label")


class TagSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__")

    class Meta:
        model = Tag
        fields = ("pk", "label")


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    category = CategorySerializer()
    tags = TagSerializer(many=True)

    class Meta:
        model = Transaction
        fields = (
            "pk",
            "datetime",
            "amount",
            "amount_currency",
            "account",
            "category",
            "tags",
            "text",
            "reference",
        )
