from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Account


@receiver(post_delete, sender=Account)
def account_deleted(sender, instance, **kwargs):
    """
    Fix positions for remaining accounts after deletion.

    """
    accounts = instance.user.accounts.all()
    for i, account in enumerate(accounts):
        account.pos = i
        account.save()
