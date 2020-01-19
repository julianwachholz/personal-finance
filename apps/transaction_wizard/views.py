import os

from django.conf import settings
from rest_framework import viewsets

from .models import ImportFile
from .serializers import ImportFileSerializer


class ImportFileViewSet(viewsets.ModelViewSet):
    """
    API endpoint to show previously uploaded files.
    """

    serializer_class = ImportFileSerializer

    def get_queryset(self):
        return ImportFile.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        filename = os.path.join(settings.MEDIA_ROOT, instance.file.name)
        os.remove(filename)
        return super().perform_destroy(instance)
