from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import signing
from django.core.exceptions import ValidationError
from django.core.signing import BadSignature, SignatureExpired
from django.utils.translation import get_language
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

        if not user:
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
    password = serializers.CharField(required=False, write_only=True)
    old_password = serializers.CharField(required=False, write_only=True)
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
            "settings",
            "password",
            "old_password",
        )

    def validate(self, data):
        user = self.context["request"].user
        if not user and "password" not in data:
            raise ValidationError({"password": "Please provide a new password"})

        if "password" in data or "old_password" in data:
            if not user or user.is_anonymous:
                user = User(**data)
            else:
                old_password = data.get("old_password")
                if not user.check_password(old_password):
                    raise ValidationError({"old_password": _("Invalid password")})

            password = data["password"]
            try:
                validate_password(password=password, user=user)
            except ValidationError as e:
                raise ValidationError({"password": e.messages})
        return super().validate(data)

    def create(self, validated_data):
        user = User.objects.create_user(is_active=False, **validated_data)
        user.settings.language = get_language()
        user.settings.save()
        return user

    def update(self, user, validated_data):
        new_password = validated_data.pop("password", None)
        if new_password:
            user.set_password(new_password)
        return super().update(user, validated_data)


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            signed_data = signing.loads(
                data["token"], salt="reset-password", max_age=60 * 120
            )
        except BadSignature:
            raise ValidationError(_("Invalid link."))
        except SignatureExpired:
            raise ValidationError(_("Link expired."))

        user = User.objects.get(pk=signed_data["user_pk"])
        new_password = data["new_password"]

        try:
            validate_password(password=new_password, user=user)
        except ValidationError as e:
            raise ValidationError({"new_password": e.messages})
        return {"user": user, "new_password": new_password}

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
