from rest_framework import serializers

from apps.accounts.models import Account
from apps.categories.models import Category
from apps.payees.models import Payee
from apps.tags.models import Tag

from .models import Transaction


class RelatedSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__")


class AccountSerializer(RelatedSerializer):
    class Meta:
        model = Account
        fields = ("pk", "label")


class CategorySerializer(RelatedSerializer):
    class Meta:
        model = Category
        fields = ("pk", "label")


class PayeeSerializer(RelatedSerializer):
    class Meta:
        model = Payee
        fields = ("pk", "label")


class TagSerializer(RelatedSerializer):
    class Meta:
        model = Tag
        fields = ("pk", "label")


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    category = CategorySerializer()
    payee = PayeeSerializer()
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
            "payee",
            "tags",
            "text",
            "is_transfer",
            "reference",
        )
