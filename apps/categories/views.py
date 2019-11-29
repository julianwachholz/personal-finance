from rest_framework import viewsets
from mptt.utils import get_cached_trees

from .models import Category
from .serializers import CategorySerializer, NestedCategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_fields = ["parent"]
    search_fields = ["name", "parent__name"]
    ordering_fields = ["name"]


class CategoryTreeViewSet(CategoryViewSet):
    """
    Get a tree structure of your categories.
    """

    queryset = Category.objects.root_nodes()
    read_only = True
    serializer_class = NestedCategorySerializer
