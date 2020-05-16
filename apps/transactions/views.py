import csv
import io

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django_filters import rest_framework as filters
from djmoney.models.fields import CURRENCY_CHOICES
from rest_framework import viewsets

from apps.categories.models import Category
from util.views import BulkDeleteViewSetMixin

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


class TransactionViewSet(BulkDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    API endpoint to manage transactions.
    """

    serializer_class = TransactionSerializer
    filterset_class = TransactionFilterSet
    search_fields = ("text", "=reference", "payee__name", "category__name")
    ordering_fields = ("datetime",)

    def get_queryset(self):
        qs = Transaction.objects.filter(user=self.request.user)
        qs = qs.select_related("account", "category", "payee")
        qs = qs.prefetch_related("tags")
        return qs


@login_required
def export(request):

    headers = [
        "(1)Type",
        "(2)Date",
        "(3)Item or Payee",
        "(4)Amount",
        "(5)Currency",
        "(6)ConversionRate",
        "(7)Parent Category",
        "(8)Category",
        "(9)Account Type",
        "(10)Account",
        "(11)Notes",
        "(12) Label",
        "(13) Status",
        "(14) Split",
    ]

    fp = io.StringIO()
    export = csv.writer(fp, quoting=csv.QUOTE_MINIMAL)
    export.writerow(headers)

    user = request.user

    qs = Transaction.objects.filter(user=user, is_initial=False)
    qs = qs.select_related("account", "category", "payee")
    qs = qs.prefetch_related("tags")

    for tx in qs:
        category = tx.category
        row = [
            # Type,
            "T" if tx.is_transfer() else "I" if tx.is_credit() else "E",
            # Date
            tx.datetime.strftime("%m/%d/%Y"),
            # Item or payee,
            tx.payee.name if tx.payee else None,
            # Amount,
            tx.amount.amount if tx.is_transfer() else abs(tx.amount.amount),
            # Currency,
            tx.amount.currency,
            # ConversionRate,
            1,
            # Parent Category
            tx.category.parent.name
            if category is not None and category.parent is not None
            else None,
            # Category
            category.name if category else None,
            # Account Type
            tx.account.institution,
            # Account
            tx.account.name,
            # Notes
            tx.text,
            # Label,
            " ".join(tag.name for tag in tx.tags.all()),
            # Status,
            "R" if tx.is_reconciled else "",
            # Split,
            "",
        ]
        export.writerow(row)

    return HttpResponse(fp.getvalue(), content_type="text/csv; charset=utf-8")
