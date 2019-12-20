from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"], None, validated_data["password"]
        )
        return user
