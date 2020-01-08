from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from apps.categories.models import Category
from util.serializers import UserPKField

from .models import Payee


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")

    class Meta:
        model = Category
        fields = ["pk", "label"]


class PayeeSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    default_category = CategorySerializer(read_only=True)
    set_default_category = UserPKField(
        source="default_category",
        queryset=Category.objects,
        required=False,
        write_only=True,
    )

    class Meta:
        model = Payee
        fields = [
            "pk",
            "name",
            "label",
            "user",
            "type",
            "default_category",
            "set_default_category",
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=Payee.objects,
                fields=["user", "name"],
                message=_("Payee with that name already exists"),
            )
        ]
