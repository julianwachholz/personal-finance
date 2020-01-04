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
        fields = ("pk", "label", "color")


class PKField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        request = self.context.get("request", None)
        queryset = super().get_queryset()
        if not request:
            raise Exception("no request")
            return queryset.none()
        return queryset.filter(user=request.user)


class TransactionSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    payee = PayeeSerializer(read_only=True)
    tags = TagSerializer(read_only=True, many=True)

    set_account = PKField(source="account", queryset=Account.objects, write_only=True)
    set_category = PKField(
        source="category", queryset=Category.objects, required=False, write_only=True
    )
    set_payee = PKField(
        source="payee", queryset=Payee.objects, required=False, write_only=True
    )
    set_tags = PKField(
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
