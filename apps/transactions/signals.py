from django.db.models import F
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Transaction


@receiver(pre_save, sender=Transaction)
def pre_save_transaction(sender, instance, **kwargs):
    if instance.pk is None:
        return
    try:
        old_tx = Transaction.objects.get(pk=instance.pk)

        # Fix account balance if a transaction was moved to another account.
        if (
            instance.account != old_tx.account
            and old_tx.account.initial_date < old_tx.datetime
        ):
            old_tx.account.balance = F("balance") - old_tx.amount
            old_tx.account.save()
    except Transaction.DoesNotExist:
        pass


@receiver(post_save, sender=Transaction)
def post_save_transaction(sender, instance, created, **kwargs):
    """
    Update account balance when a transaction was created or updated.
    """
    tx = instance
    if created and not tx.is_initial:
        if tx.account.initial_date < tx.datetime:
            tx.account.balance = F("balance") + tx.amount
            tx.account.save()
    else:
        tx.account.reconcile()


@receiver(post_delete, sender=Transaction)
def post_delete_transaction(sender, instance, **kwargs):
    instance.account.reconcile()
