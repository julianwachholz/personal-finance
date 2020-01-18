from rest_framework import serializers

from util.serializers import UserPKField, UserPKWithLabelField

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    icon = serializers.CharField(source="get_icon", read_only=True)
    color = serializers.CharField(source="get_color", read_only=True)
    parent = UserPKWithLabelField(read_only=True)

    set_icon = serializers.CharField(
        source="icon", required=False, write_only=True, allow_blank=True
    )
    set_color = serializers.CharField(
        source="color", required=False, write_only=True, allow_blank=True
    )
    my_icon = serializers.CharField(source="icon", read_only=True)
    my_color = serializers.CharField(source="color", read_only=True)

    position = serializers.ChoiceField(
        choices=["first-child", "last-child", "left", "right"],
        write_only=True,
        required=False,
    )
    target = UserPKField(queryset=Category.objects, write_only=True, required=False)

    class Meta:
        model = Category
        fields = [
            "pk",
            "user",
            "label",
            "name",
            "icon",
            "color",
            "parent",
            "set_icon",
            "set_color",
            "my_icon",
            "my_color",
            "position",
            "target",
        ]

    def create(self, data):
        if "target" in data and data["user"] != data["target"].user:
            raise serializers.ValidationError(
                "target category does not belong to same user"
            )
        position = data.pop("position")
        target = data.pop("target", None)
        category = Category(**data)
        category.insert_at(target, position, save=True)
        return category


class RecursiveSerializer(serializers.Serializer):
    def to_representation(self, instance):
        serializer = self.parent.parent.__class__(instance, context=self.context)
        return serializer.data


class CategoryTreeSerializer(CategorySerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["pk", "label", "color", "children"]

    def to_representation(self, category):
        rep = super().to_representation(category)
        if rep["children"] is None:
            rep.pop("children")
        return rep

    def get_children(self, obj):
        children = obj.get_children()
        if not children:
            return None
        serializer = CategoryTreeSerializer(children, many=True, context=self.context)
        return serializer.data
