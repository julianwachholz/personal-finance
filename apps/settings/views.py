from rest_framework import generics

from .serializers import SettingsSerializer


class SettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = SettingsSerializer

    def get_object(self):
        return self.request.user.settings
