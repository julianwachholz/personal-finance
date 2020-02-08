import os

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.response import Response

from .models import ImportConfig, ImportFile, ValueMapping
from .serializers import (ImportConfigSerializer, ImportFileSerializer,
                          ValueMappingSerializer)


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
    API endpoint to configure imports and their column mappings.

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

    @action(detail=True, methods=["post"])
    def import_file(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.GET.get("file")
        )
        data = config.map_dataset(file.dataset)
        return Response(data)


class ValueMappingViewSet(viewsets.ModelViewSet):
    """
    API endpoint to map import values to app objects.

    """

    TYPE_MAP = {
        "account": {"app_label": "accounts", "model": "account"},
        "payee": {"app_label": "payees", "model": "payee"},
        "category": {"app_label": "categories", "model": "category"},
    }

    serializer_class = ValueMappingSerializer

    def get_queryset(self):
        return ValueMapping.objects.filter(user=self.request.user)

    def get_object(self, **kwargs):
        if not kwargs:
            content_type_name, object_id = self.kwargs["pk"].split("-")
        else:
            content_type_name = kwargs["content_type"]
            object_id = kwargs["object_id"]

        if content_type_name not in self.TYPE_MAP:
            raise NotFound()

        content_type = ContentType.objects.get(**self.TYPE_MAP[content_type_name])
        try:
            return ValueMapping.objects.get_by_natural_key(
                content_type=content_type, object_id=object_id
            )
        except ValueMapping.DoesNotExist:
            return ValueMapping(
                user=self.request.user,
                content_type=content_type,
                object_id=object_id,
                values=[],
            )

    def create(self, request, *args, **kwargs):
        instance = self.get_object(
            content_type=request.data["content_type"],
            object_id=request.data["object_id"],
        )
        serializer = self.get_serializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    @action(detail=False, methods=["post"])
    def bulk_create(self, request, **kwargs):
        count = len(request.data)
        # TODO
        return Response({"status": "ok", "count": count})
