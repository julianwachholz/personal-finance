from django.apps import AppConfig


class SettingsConfig(AppConfig):
    name = "apps.settings"

    def ready(self):
        # Register signals
        from . import signals  # noqa
