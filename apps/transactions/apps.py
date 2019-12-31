from django.apps import AppConfig


class TransactionsConfig(AppConfig):
    name = "apps.transactions"

    def ready(self):
        from . import signals  # noqa
