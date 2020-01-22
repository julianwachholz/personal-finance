from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .emails import send_verification_email

User = get_user_model()


@receiver(post_save, sender=User)
def post_save_user(sender, instance, created, **kwargs):
    if created:
        send_verification_email(instance)
