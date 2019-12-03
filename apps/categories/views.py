from mptt.utils import get_cached_trees
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category
from .serializers import CategorySerializer, CategoryTreeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """

    serializer_class = CategorySerializer
    search_fields = ["name", "parent__name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    @action(detail=False)
    def tree(self, request, **kwargs):
        categories = self.get_queryset().get_cached_trees()
        serializer = CategoryTreeSerializer(categories, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data})
