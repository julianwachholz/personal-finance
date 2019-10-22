from django.db import models
from django.views.generic import ListView


class AccountListView(ListView):
    def get_queryset(self):
        return self.request.user.accounts.all()

    def total_balance(self):
        return self.request.user.accounts.aggregate(models.Sum("balance"))

    def get_context_data(self, **kwargs):
        return super().get_context_data(total_balance=self.total_balance(), **kwargs)


account_list = AccountListView.as_view()
