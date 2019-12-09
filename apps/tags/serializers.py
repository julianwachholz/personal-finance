from rest_framework import serializers

from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True, source="__str__")

    class Meta:
        model = Tag
        fields = ["pk", "label", "name", "color"]
