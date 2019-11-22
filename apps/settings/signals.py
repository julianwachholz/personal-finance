from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Settings


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def user_created(sender, instance, created, **kwargs):
    """
    Create a settings object for a newly created user.

    """
    try:
        instance.settings
    except Settings.DoesNotExist:
        Settings.objects.create(user=instance)
