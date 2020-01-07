from django.db.models import F
from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from .models import Transaction


@receiver(pre_save, sender=Transaction)
def pre_save_transaction(sender, instance, **kwargs):
    try:
        current = Transaction.objects.get(pk=instance.pk)
        if (
            instance.account != current.account
            and current.account.initial_date < current.datetime
        ):
            current.account.balance = F("balance") - current.amount
            current.account.save()
    except Transaction.DoesNotExist:
        pass


@receiver(post_save, sender=Transaction)
def post_save_transaction(sender, instance, created, **kwargs):
    """
    Update the transaction account balance.

    """
    if created and not instance.is_initial:
        if instance.account.initial_date < instance.datetime:
            instance.account.balance = F("balance") + instance.amount
            instance.account.save()
    else:
        instance.account.reconcile()


@receiver(post_delete, sender=Transaction)
def post_delete_transaction(sender, instance, **kwargs):
    instance.account.reconcile()
