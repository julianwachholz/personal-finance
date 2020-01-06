from django_filters import rest_framework as filters
from rest_framework import viewsets

from util.views import BulkDeleteViewSetMixin

from .models import Payee
from .serializers import PayeeSerializer


class PayeeFilterSet(filters.FilterSet):
    class Meta:
        model = Payee
        fields = ("type",)


class PayeeViewSet(BulkDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows payees to be viewed or edited.
    """

    serializer_class = PayeeSerializer
    filterset_class = PayeeFilterSet
    search_fields = ["name"]
    ordering_fields = ["name"]

    def get_queryset(self):
        return Payee.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
