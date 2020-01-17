from django.contrib.postgres.fields import CICharField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _


class Payee(models.Model):
    """
    A payee is a recipient for transactions.

    """

    TYPE_BUSINESS = "business"
    TYPE_PRIVATE = "private"
    TYPE_CHOICES = (("business", _("business")), ("private", _("person")))

    name = CICharField(verbose_name=_("name"), max_length=100)

    type = models.CharField(
        verbose_name=_("type"),
        max_length=100,
        choices=TYPE_CHOICES,
        default=TYPE_BUSINESS,
    )

    default_category = models.ForeignKey(
        to="categories.Category", on_delete=models.SET_NULL, blank=True, null=True
    )

    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="payees"
    )

    class Meta:
        verbose_name = _("payee")
        verbose_name_plural = _("payees")
        unique_together = ("user", "name")
        ordering = ("name",)

    def __str__(self):
        return self.name

    def clean(self):
        if self.default_category.user != self.user:
            raise ValidationError(
                {"default_category": _("Category does not belong to same user")}
            )
