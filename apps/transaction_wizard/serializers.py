from operator import itemgetter

from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

from .models import ColumnMapping, ImportConfig, ImportFile, ValueMapping


class MatchingMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnMapping
        fields = ("target",)


class MatchingImportConfigSerializer(serializers.ModelSerializer):
    # mappings = MatchingMappingSerializer(many=True, read_only=True)
    mappings = serializers.StringRelatedField(many=True)

    class Meta:
        model = ImportConfig
        fields = ("pk", "last_use", "mappings")


class ImportFileSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    datetime = serializers.DateTimeField(read_only=True)
    type = serializers.CharField(read_only=True)
    file = serializers.FileField(write_only=True)
    headers = serializers.ReadOnlyField()
    matching_configs = MatchingImportConfigSerializer(many=True, read_only=True)

    class Meta:
        model = ImportFile
        fields = (
            "pk",
            "label",
            "user",
            "file",
            "type",
            "datetime",
            "headers",
            "matching_configs",
        )


class ColumnMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnMapping
        fields = ("target", "is_sourced", "source", "options")


class ImportConfigSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    last_use = serializers.ReadOnlyField()

    mappings = ColumnMappingSerializer(many=True)

    class Meta:
        model = ImportConfig
        fields = ("pk", "user", "last_use", "file_type", "mappings")

    def create(self, data):
        mappings = data.pop("mappings")
        config = ImportConfig.objects.create(**data)
        for mapping in mappings:
            config.mappings.create(**mapping)
        return config

    def update(self, instance, data):
        mappings = data.pop("mappings")
        mapped_targets = map(itemgetter("target"), mappings)
        instance.mappings.exclude(target__in=mapped_targets).delete()

        for mapping in mappings:
            updated = instance.mappings.filter(target=mapping["target"]).update(
                **mapping
            )
            if not updated:
                instance.mappings.create(**mapping)
        return instance


class ValueMappingListSerializer(serializers.ListSerializer):
    def update(self, instance, data):
        return self.child.update(instance, data)


class ValueMappingSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    content_type = serializers.SlugRelatedField(
        slug_field="model", queryset=ContentType.objects
    )
    values = serializers.ReadOnlyField()
    value = serializers.CharField(write_only=True)

    class Meta:
        model = ValueMapping
        list_serializer_class = ValueMappingListSerializer
        fields = ("user", "content_type", "object_id", "values", "value")

    def update(self, instance, data):
        """Add the new value to the mapping values."""
        values = set(instance.values)
        if data["value"] in values:
            return instance
        values.add(data["value"])
        instance.values = list(values)
        instance.save()
        return instance
