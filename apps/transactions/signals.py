from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.accounts.models import Account

from .models import Transaction


@receiver(post_save, sender=Transaction)
def post_save_transaction(sender, instance, created, **kwargs):
    """
    Update the transaction account balance.

    """
    if created and not instance.is_initial:
        instance.account.balance = F("balance") + instance.amount
        instance.account.save()
    else:
        instance.account.reconcile()
