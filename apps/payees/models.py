from django.contrib.postgres.fields import CICharField
from django.core.exceptions import ValidationError
from django.db import models


class Payee(models.Model):
    """
    A payee is a recipient for transactions.

    """

    TYPE_BUSINESS = "business"
    TYPE_PRIVATE = "private"
    TYPE_CHOICES = (("business", "business"), ("private", "person"))

    name = CICharField(verbose_name="name", max_length=100)

    type = models.CharField(
        verbose_name="type", max_length=100, choices=TYPE_CHOICES, default=TYPE_BUSINESS
    )

    default_category = models.ForeignKey(
        to="categories.Category", on_delete=models.SET_NULL, blank=True, null=True
    )

    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="payees"
    )

    class Meta:
        verbose_name = "payee"
        verbose_name_plural = "payees"
        unique_together = ("user", "name")
        ordering = ("name",)

    def __str__(self):
        return self.name

    def clean(self):
        if self.default_category.user != self.user:
            raise ValidationError(
                {"default_category": "Category does not belong to same user"}
            )
