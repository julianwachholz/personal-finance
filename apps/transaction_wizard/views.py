import os

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import exceptions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ImportConfig, ImportFile
from .serializers import ImportConfigSerializer, ImportFileSerializer


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


class ImportConfigViewSet(viewsets.ModelViewSet):
    """
    API endpoint to configure imports.
    """

    serializer_class = ImportConfigSerializer

    def get_queryset(self):
        return ImportConfig.objects.filter(user=self.request.user)

    @action(detail=True, methods=["get"])
    def preview(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.GET.get("file")
        )
        return Response(config.get_preview(file.dataset))

    @action(detail=True, methods=["get"])
    def unmapped_values(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.GET.get("file")
        )
        return Response(config.get_unmapped_values(file.dataset))

    @action(detail=True, methods=["get"])
    def import_file(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.GET.get("file")
        )
        data = config.map_dataset(file.dataset)
        return Response(data)
