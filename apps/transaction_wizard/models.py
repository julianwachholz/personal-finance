import os

from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _
from tablib import detect_format, import_set


def upload_path(instance, filename):
    return f"import/{instance.user.id}/{filename}"


class ImportFile(models.Model):
    """
    A file to be imported by a user.
    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE, related_name="+")

    file = models.FileField(upload_to=upload_path)

    type = models.CharField(max_length=100)

    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _("import file")
        verbose_name_plural = _("import files")
        ordering = ("user", "-datetime")

    def __str__(self):
        return os.path.basename(self.file.name)

    def save(self, **kwargs):
        self.type = self.file.file.content_type
        return super().save(**kwargs)

    @cached_property
    def dataset(self):
        with self.file.open("r") as fh:
            fmt = detect_format(fh)
            data = import_set(fh, format=fmt)
        return data

    @property
    def headers(self):
        return self.dataset.headers
