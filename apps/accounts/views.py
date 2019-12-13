from django_filters import rest_framework as filters
from djmoney.models.fields import CURRENCY_CHOICES
from rest_framework import viewsets

from .models import Account
from .serializers import AccountSerializer


class AccountFilterSet(filters.FilterSet):
    currency = filters.MultipleChoiceFilter(
        field_name="balance_currency", choices=CURRENCY_CHOICES
    )

    class Meta:
        model = Account
        fields = ("currency",)


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accounts to be viewed or edited.
    """

    serializer_class = AccountSerializer
    filterset_class = AccountFilterSet
    search_fields = ["name", "institution"]
    ordering_fields = ["name", "institution", "balance"]

    def get_queryset(self):
        return self.request.user.accounts.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
