from rest_framework import generics, permissions
from rest_framework.authentication import BaseAuthentication

from knox.views import LoginView as KnoxLoginView

from .serializers import LoginSerializer, UserSerializer


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class JSONAuthentication(BaseAuthentication):
    def authenticate(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return (serializer.validated_data["user"], None)


class LoginView(KnoxLoginView):
    authentication_classes = (JSONAuthentication,)
    permission_classes = (permissions.AllowAny,)
