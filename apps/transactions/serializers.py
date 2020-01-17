from rest_framework import serializers

from apps.accounts.models import Account
from apps.categories.models import Category
from apps.payees.models import Payee
from apps.tags.models import Tag
from util.serializers import UserPKWithLabelField

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    account = UserPKWithLabelField(queryset=Account.objects, extra=["icon"])
    category = UserPKWithLabelField(
        queryset=Category.objects,
        extra=[("icon", "get_icon"), "name"],
        required=False,
        allow_null=True,
    )
    payee = UserPKWithLabelField(
        queryset=Payee.objects, required=False, allow_null=True
    )
    tags = UserPKWithLabelField(
        queryset=Tag.objects, extra=["color"], many=True, required=False
    )

    class Meta:
        model = Transaction
        fields = (
            "pk",
            "user",
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
        )
