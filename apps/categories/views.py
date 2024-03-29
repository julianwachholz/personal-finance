from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, create_default_categories
from .serializers import CategorySerializer, CategoryTreeSerializer


class CategoryFilterSet(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = Category
        fields = ("name",)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """

    serializer_class = CategorySerializer
    filterset_class = CategoryFilterSet
    search_fields = ["name", "parent__name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    @action(detail=False)
    def tree(self, request, **kwargs):
        categories = self.get_queryset().get_cached_trees()
        serializer = CategoryTreeSerializer(categories, many=True)
        return Response({"count": len(serializer.data), "results": serializer.data})

    @action(detail=True, methods=["post"])
    def move(self, request, pk, **kwargs):
        target_pk = request.data["target_pk"]
        position = request.data["position"]
        node = self.get_queryset().get(pk=pk)
        target = self.get_queryset().get(pk=target_pk)
        try:
            node.move_to(target, position)
        except Exception as e:
            return Response(
                {"status": "error", "error": str(e)}, status=400, exception=e
            )
        return Response(status=204)

    @action(detail=False, methods=["post"])
    def create_default(self, request, **kwargs):
        if self.get_queryset().count():
            return Response({"status": "error", "error": "Categories already exist."})
        user = self.request.user
        create_default_categories(user)
        return Response(status=204)
