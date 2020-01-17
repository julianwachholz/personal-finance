from django.db.models import DecimalField, F, Func
from django.db.models.functions import Cast
from rest_framework import viewsets

from util.views import BulkDeleteViewSetMixin

from .serializers import TagSerializer


class TagViewSet(BulkDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """

    serializer_class = TagSerializer
    search_fields = ["name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return self.request.user.tags.all()

    def filter_queryset(self, qs):
        qs = super().filter_queryset(qs)
        if not qs.ordered:
            qs = qs.order_by(
                Cast(
                    Func(F("use_count") + 1, function="LOG"),
                    DecimalField(max_digits=4, decimal_places=1),
                ).desc(),
                "-last_used",
            )
        return qs
