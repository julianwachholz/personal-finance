from rest_framework import serializers

from .models import ImportFile


class ImportFileSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="__str__", read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    datetime = serializers.DateTimeField(read_only=True)
    type = serializers.CharField(read_only=True)
    file = serializers.FileField(write_only=True)

    class Meta:
        model = ImportFile
        fields = (
            "pk",
            "label",
            "user",
            "file",
            "type",
            "datetime",
        )
