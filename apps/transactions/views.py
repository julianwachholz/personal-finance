from django_filters import rest_framework as filters
from djmoney.models.fields import CURRENCY_CHOICES
from mptt.models import MPTTModel
from rest_framework import viewsets

from apps.categories.models import Category

from .models import Transaction
from .serializers import TransactionSerializer


class InHierarchyFilter(filters.ModelChoiceFilter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.lookup_expr = "lft__range"

    def filter(self, qs, value):
        if value:
            return qs.filter(
                category__tree_id=value.tree_id,
                category__lft__range=(value.lft, value.rght),
            )
        return super().filter(qs, value)


def filter_categories(request):
    if request is None:
        return Category.objects.none()
    return Category.objects.filter(user=request.user)


class TransactionFilterSet(filters.FilterSet):
    currency = filters.MultipleChoiceFilter(
        field_name="amount_currency", choices=CURRENCY_CHOICES
    )
    category = InHierarchyFilter(queryset=filter_categories)

    class Meta:
        model = Transaction
        fields = ("currency", "category", "account", "payee", "tags")


class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage transactions.
    """

    serializer_class = TransactionSerializer
    filterset_class = TransactionFilterSet
    search_fields = ("text", "=reference", "payee__name")
    ordering_fields = ("datetime",)

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)
        qs = qs.select_related("account", "category", "payee")
        qs = qs.prefetch_related("tags")
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
