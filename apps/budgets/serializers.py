from rest_framework import serializers

from apps.categories.models import Category
from apps.transactions.models import Transaction
from util.serializers import UserPKWithLabelField

from .models import Budget


class TxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("pk", "datetime", "amount", "amount_currency")


class BudgetSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    categories = UserPKWithLabelField(
        queryset=Category.objects, many=True, required=False
    )

    current_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    remaining_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Budget
        fields = (
            "pk",
            "label",
            "user",
            "name",
            "pos",
            "period",
            "is_blacklist",
            "categories",
            "target",
            "target_currency",
            "current_amount",
            "remaining_amount",
            "percentage",
        )
