from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tag
from .serializers import TagSerializer


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """

    serializer_class = TagSerializer
    search_fields = ["name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["DELETE"])
    def bulk_delete(self, request, **kwargs):
        pks = request.data["pks"]
        try:
            deleted, related = self.get_queryset().filter(pk__in=pks).delete()
            return Response({"status": "ok", "deleted": deleted})
        except Exception as e:
            return Response(
                {"status": "error", "error": str(e)}, status=400, exception=e
            )
