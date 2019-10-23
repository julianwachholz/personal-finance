from colorfield.fields import ColorField
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Tag(models.Model):
    """
    A tag to classify something.

    """

    user = models.ForeignKey(to="auth.User", on_delete=models.CASCADE)

    name = models.CharField(max_length=100)

    color = ColorField(verbose_name=_("color"), blank=True)

    class Meta:
        verbose_name = _("tag")
        verbose_name_plural = _("tags")
        unique_together = ("user", "name")
        ordering = ("name",)

    def __str__(self):
        return f"#{self.name}"
