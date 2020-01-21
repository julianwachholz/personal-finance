from django.contrib.auth import get_user_model
from django.core import signing
from django.core.signing import SignatureExpired
from django.utils.translation import ugettext_lazy as _
from knox.auth import TokenAuthentication
from knox.views import LoginView as KnoxLoginView
from rest_framework import generics, permissions
from rest_framework.authentication import BaseAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer, UserSerializer

User = get_user_model()


class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserVerifyView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        try:
            token = request.data.get("token")
            data = signing.loads(token, max_age=60 * 180)  # 2 hours

            user = User.objects.filter(is_active=False).get(pk=data["user_pk"])
            user.is_active = True
            user.save()

            return Response({"status": "ok", "username": user.username})
        except KeyError:
            return Response({"status": "error"}, status=400)
        except User.DoesNotExist:
            return Response(
                {"status": "error", "error": _("Link was already used.")}, status=400
            )
        except SignatureExpired:
            return Response(
                {"status": "error", "error": _("Link expired.")}, status=400
            )


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)


class JSONAuthentication(BaseAuthentication):
    def authenticate(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return (serializer.validated_data["user"], None)


class LoginView(KnoxLoginView):
    authentication_classes = (JSONAuthentication,)
    permission_classes = (permissions.AllowAny,)
