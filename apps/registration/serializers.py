from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.settings.serializers import SettingsSerializer

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(default="")
    password = serializers.CharField(default="", style={"input_type": "password"})

    def validate(self, attrs):
        user = self.authenticate(
            username=attrs.get("username"), password=attrs.get("password")
        )
        del attrs["password"]

        if user:
            if not user.is_active:
                raise ValidationError(_("User is inactive."))
        else:
            raise ValidationError(_("Invalid credentials."))

        attrs["user"] = user
        return attrs

    def authenticate(self, **kwargs):
        return authenticate(self.context["request"], **kwargs)


class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(read_only=True)
    password = serializers.CharField(required=False, write_only=True)
    settings = SettingsSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            "pk",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "password",
            "settings",
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"], None, validated_data["password"]
        )
        return user
