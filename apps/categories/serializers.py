from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):

    label = serializers.CharField(source="__str__", read_only=True)
    icon = serializers.CharField(source="get_icon", read_only=True)
    color = serializers.CharField(source="get_color", read_only=True)

    class Meta:
        model = Category
        fields = ["pk", "label", "name", "icon", "color", "parent"]


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data


class NestedCategorySerializer(serializers.ModelSerializer):
    children = RecursiveSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["pk", "name", "get_icon", "get_color", "children"]
