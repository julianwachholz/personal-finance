import os

from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from apps.transactions.serializers import TransactionSerializer

from .models import ImportConfig, ImportFile, ValueMapping
from .serializers import (
    ImportConfigSerializer,
    ImportFileSerializer,
    ValueMappingSerializer,
)


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

    @action(detail=True, methods=["post"])
    def preview(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.data.get("file")
        )
        transactions = config.get_preview(file.dataset)
        serializer = TransactionSerializer(transactions, many=True)
        return Response({"results": serializer.data})

    @action(detail=True, methods=["post"])
    def unmapped_values(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.data.get("file")
        )
        return Response(config.get_unmapped_values(file.dataset))

    @action(detail=True, methods=["post"])
    def import_file(self, request, pk, **kwargs):
        config = self.get_object()
        file = get_object_or_404(
            ImportFile, user=request.user, pk=request.data.get("file")
        )
        auto_reconcile = request.data.get("auto_reconcile", False)
        try:
            count = config.import_dataset(file.dataset, auto_reconcile=auto_reconcile)
        except Exception as e:
            return Response(
                {"status": "error", "error": str(e)}, status=500, exception=e
            )
        return Response({"status": "ok", "count": count})


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
            model, object_id = self.kwargs["pk"].split("-")
        else:
            model = kwargs["content_type"]
            object_id = kwargs["object_id"]

        if model not in self.TYPE_MAP:
            raise NotFound()

        content_type = ContentType.objects.get(**self.TYPE_MAP[model])
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
        for data in request.data:
            instance = self.get_object(
                content_type=data["content_type"], object_id=data["object_id"]
            )
            serializer = self.get_serializer(instance=instance, data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
        return Response({"status": "ok"}, status=201)
