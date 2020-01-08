from django.contrib.postgres.fields import CICharField
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Tag(models.Model):
    """
    A tag to classify something.

    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    name = CICharField(max_length=100)

    color = models.CharField(verbose_name=_("color"), max_length=100, blank=True)

    class Meta:
        verbose_name = _("tag")
        verbose_name_plural = _("tags")
        unique_together = ("user", "name")
        ordering = ("name",)

    def __str__(self):
        return f"#{self.name}"
