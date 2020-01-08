from rest_framework import viewsets

from util.views import BulkDeleteViewSetMixin

from .models import Tag
from .serializers import TagSerializer


class TagViewSet(BulkDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """

    serializer_class = TagSerializer
    search_fields = ["name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)
