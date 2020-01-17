from rest_framework import viewsets

from .serializers import BudgetSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    """
    API endpoint to modify budgets.
    """

    serializer_class = BudgetSerializer
    search_fields = ("name",)

    def get_queryset(self):
        return self.request.user.budgets.all()

    def perform_create(self, serializer):
        pos = self.request.user.budgets.count()
        serializer.save(pos=pos)
