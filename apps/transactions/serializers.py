from rest_framework import serializers

from apps.accounts.models import Account
from apps.categories.models import Category
from apps.payees.models import Payee
from apps.tags.models import Tag
from util.serializers import UserPKField

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
        fields = ("pk", "label", "color")


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    payee = PayeeSerializer(read_only=True)
    tags = TagSerializer(read_only=True, many=True)

    set_account = UserPKField(
        source="account", queryset=Account.objects, write_only=True
    )
    set_category = UserPKField(
        source="category",
        queryset=Category.objects,
        required=False,
        allow_null=True,
        write_only=True,
    )
    set_payee = UserPKField(
        source="payee",
        queryset=Payee.objects,
        required=False,
        allow_null=True,
        write_only=True,
    )
    set_tags = UserPKField(
        many=True, source="tags", queryset=Tag.objects, required=False, write_only=True
    )

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
            "is_initial",
            "reference",
            "set_account",
            "set_category",
            "set_payee",
            "set_tags",
        )
