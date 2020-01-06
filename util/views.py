from rest_framework.decorators import action
from rest_framework.response import Response


class BulkDeleteViewSetMixin:
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
