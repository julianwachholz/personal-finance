from django.db import models
from django.utils.translation import ugettext_lazy as _

from dateutil.rrule import (
    MO, TU, WE, TH, FR, SA, SU
)


class AbstractTransaction:
    """
    Abstract base transaction.

    """
    account = models.ForeignKey(to='accounts.Account', on_delete=models.CASCADE)

    user = models.ForeignKey(to='auth.User', on_delete=models.CASCADE)

    amount = models.DecimalField(verbose_name=_('amount'), max_digits=10, decimal_places=2)

    text = models.CharField(verbose_name=_('text'), max_length=500, blank=True)


class Transaction(AbstractTransaction):
    """
    A transaction on an account.

    """

    datetime = models.DateTimeField(verbose_name=_('date / time'), auto_now_add=True)

    class Meta:
        verbose_name = _('transaction')
        verbose_name_plural = _('transactions')
        ordering = ('datetime',)

    def __str__(self):
        return f'{self.amount}'


class PlannedTransaction(AbstractTransaction):
    """
    A planned transaction that can repeat.

    """

    start = models.DateTimeField(verbose_name=_('start date / time'))
    end = models.DateTimeField(verbose_name=_('end date / time'), blank=True, null=True)

    is_repeating = models.BooleanField(verbose_name=_('is repeating?'), default=False)


class Rule(models.Model):
    """
    A recurrence rule.

    """

    FREQUENCY_DAILY = 'DAILY'
    FREQUENCY_WEEKLY = 'WEEKLY'
    FREQUENCY_MONTHLY = 'MONTHLY'
    FREQUENCY_YEARLY = 'YEARLY'
    FREQUENCY_CHOICES = (
        (FREQUENCY_DAILY, _('daily')),
        (FREQUENCY_WEEKLY, _('weekly')),
        (FREQUENCY_MONTHLY, _('monthly')),
        (FREQUENCY_YEARLY, _('yearly')),
    )

    frequency = models.CharField(verbose_name=_('frequency'), choices=FREQUENCY_CHOICES)
    interval = models.PositiveIntegerField(verbose_name=_('interval'), default=1)

    class Meta:
        verbose_name = _('rule')
        verbose_name_plural = _('rules')
