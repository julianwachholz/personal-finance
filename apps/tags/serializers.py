from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Tag
        fields = ["pk", "label", "user", "name", "color"]
        validators = [
            UniqueTogetherValidator(
                queryset=Tag.objects.all(),
                fields=["user", "name"],
                message=_("Tag with that name already exists"),
            )
        ]
