from rest_framework import viewsets

from .models import Tag
from .serializers import TagSerializer


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited.
    """

    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    search_fields = ["name"]
    ordering_fields = ["name"]
