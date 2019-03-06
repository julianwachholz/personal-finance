from django.db import models
from django.utils.translation import ugettext_lazy as _


class Account(models.Model):
    """
    A financial account holds transactions.

    """

    name = models.CharField(verbose_name=_('name'), max_length=100)

    user = models.ForeignKey(to='auth.User', on_delete=models.CASCADE)

    class Meta:
        verbose_name = _('account')
        verbose_name_plural = _('accounts')
        ordering = ('name', 'user')

    def __str__(self):
        return self.name
