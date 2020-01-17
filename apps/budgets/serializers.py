from rest_framework import serializers

from apps.categories.models import Category
from util.serializers import UserPKWithLabelField

from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    categories = UserPKWithLabelField(
        queryset=Category.objects, many=True, required=False
    )

    class Meta:
        model = Budget
        fields = (
            "label",
            "user",
            "name",
            "pos",
            "period",
            "is_blacklist",
            "categories",
            "target",
            "target_currency",
        )
