from django.apps import AppConfig


class RegistrationConfig(AppConfig):
    name = "apps.registration"

    def ready(self):
        from . import signals  # noqa
