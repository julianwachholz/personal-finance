from rest_framework import viewsets

from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage transactions.
    """

    serializer_class = TransactionSerializer
    search_fields = ("text", "reference")
    ordering_fields = ("datetime",)

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
