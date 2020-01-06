from django_filters import rest_framework as filters
from djmoney.models.fields import CURRENCY_CHOICES
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
        user = self.request.user
        pos = user.accounts.count()
        serializer.save(user=self.request.user, pos=pos)

    @action(detail=True, methods=["post"])
    def move(self, request, pk, **kwargs):
        target_pos = request.data["pos"]
        account = self.get_queryset().get(pk=pk)
        try:
            account.set_pos(target_pos)
        except Exception as e:
            return Response({"status": "error", "error": str(e)}, status=400, exception=e)
        return Response({"status": "ok"})
