import logging

from django.conf import settings
from django.core import signing
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import ugettext as _


def send_verification_email(user):
    if not user.email:
        logging.warn(
            f"User {user!r} has no email address, not sending verification email"
        )
        return

    verification = signing.dumps({"user_pk": user.pk}, salt="user-registration")
    verify_link = settings.SITE_URL + f"/verify/{verification}"
    send_mail(
        _("Complete your signup"),
        render_to_string(
            "registration/verify_email.txt", {"user": user, "verify_link": verify_link}
        ),
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )


def send_forgot_password_email(user):
    signature = signing.dumps({"user_pk": user.pk}, salt="reset-password")
    reset_link = settings.SITE_URL + f"/reset-password/{signature}"
    send_mail(
        _("Reset your password"),
        render_to_string(
            "registration/reset_password.txt", {"user": user, "reset_link": reset_link}
        ),
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )
