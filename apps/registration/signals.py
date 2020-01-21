import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _

User = get_user_model()


@receiver(post_save, sender=User)
def post_save_user(sender, instance, created, **kwargs):
    if created:
        send_verification_email(instance)


def send_verification_email(user):
    if not user.email:
        logging.warn(
            f"User {user!r} has no email address, not sending verification email"
        )
        return

    verification = signing.dumps({"user_pk": user.pk})
    verify_link = settings.SITE_URL + f"/verify/{verification}"
    send_mail(
        _("Complete your signup"),
        render_to_string("registration/verify_email.txt", {"verify_link": verify_link}),
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )
