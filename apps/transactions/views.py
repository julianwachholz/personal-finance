from rest_framework import viewsets

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage transactions.
    """

    serializer_class = TransactionSerializer
    search_fields = ("text", "=reference", "payee__name")
    ordering_fields = ("datetime",)

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)
        qs = qs.select_related("account", "category", "payee", "related")
        qs = qs.prefetch_related("tags")
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
