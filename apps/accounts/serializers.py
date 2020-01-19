from django.utils.timezone import now
from djmoney.money import Money
from rest_framework import serializers

from util.serializers import UserPKWithLabelField

from .models import Account


class AccountSerializer(serializers.HyperlinkedModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    balance = serializers.DecimalField(
        source="balance.amount", max_digits=10, decimal_places=2, read_only=True
    )
    currency = serializers.CharField(source="balance_currency", read_only=True)

    set_balance = serializers.CharField(write_only=True, required=False)
    set_currency = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Account
        fields = (
            "pk",
            "label",
            "name",
            "user",
            "institution",
            "balance",
            "set_balance",
            "currency",
            "set_currency",
            "icon",
            "pos",
        )

    def create(self, data):
        balance = Money(data.pop("set_balance"), data.pop("set_currency"))
        zero_balance = Money(0, balance.currency)
        account = Account(balance=zero_balance, **data)
        account.set_initial_balance(balance, save=True)
        return account

    def update(self, account, data):
        if "set_balance" in data:
            balance = Money(data.pop("set_balance"), data.pop("set_currency"))
            account.set_initial_balance(balance, save=False)
        super().update(account, data)
        return account


class TransferSerializer(serializers.Serializer):
    target = UserPKWithLabelField(queryset=Account.objects)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    conversion_rate = serializers.DecimalField(
        max_digits=10, decimal_places=6, default=1
    )
    text = serializers.CharField(allow_blank=True)
    datetime = serializers.DateTimeField(default=now)

    def create(self, data):
        return data["source"].transfer(
            to=data["target"],
            amount=data["amount"],
            conversion_rate=data["conversion_rate"],
            text=data["text"],
            datetime=data["datetime"],
        )
