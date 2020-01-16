from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from apps.categories.models import Category
from util.serializers import UserPKWithLabelField

from .models import Payee


class PayeeSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    default_category = UserPKWithLabelField(
        queryset=Category.objects, required=False, allow_null=True
    )

    class Meta:
        model = Payee
        fields = ["pk", "name", "label", "user", "type", "default_category"]
        validators = [
            UniqueTogetherValidator(
                queryset=Payee.objects,
                fields=["user", "name"],
                message=_("Payee with that name already exists"),
            )
        ]
