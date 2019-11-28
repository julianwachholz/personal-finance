from django.db import models
from django.views.generic import ListView
from djmoney.forms.fields import MoneyField
from djmoney.money import Money
from rest_framework import viewsets

from .serializers import AccountSerializer


class AccountListView(ListView):
    def get_queryset(self):
        return self.request.user.accounts.all()

    def total_balance(self):
        return self.request.user.accounts.aggregate(models.Sum("balance"))

    def get_context_data(self, **kwargs):
        return super().get_context_data(total_balance=self.total_balance(), **kwargs)


class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows accounts to be viewed or edited.
    """

    serializer_class = AccountSerializer
    filterset_fields = ["balance_currency"]
    search_fields = ["name", "institution"]
    ordering_fields = ["name", "balance"]

    def get_queryset(self):
        return self.request.user.accounts.all()
