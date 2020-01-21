from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

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
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects, message=_("This email is already in use.")
            )
        ],
    )
    password = serializers.CharField(required=False, write_only=True, validators=[])
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

    def validate(self, data):
        if "pk" not in data and "password" not in data:
            raise ValidationError({"password": "Please provide a password"})
        if "password" in data:
            user = User(**data)
            password = data["password"]
            try:
                validate_password(password=password, user=user)
            except ValidationError as e:
                raise ValidationError({"password": e.messages})
        return super().validate(data)

    def create(self, validated_data):
        return User.objects.create_user(is_active=False, **validated_data)
