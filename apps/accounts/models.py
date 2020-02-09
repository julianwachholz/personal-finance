from django.db import models, transaction
from django.db.models import F, Sum
from django.utils.timezone import now
from djmoney.models.fields import MoneyField


class Account(models.Model):
    """
    A financial account holds transactions.

    """

    name = models.CharField(verbose_name="name", max_length=100)

    institution = models.CharField(
        verbose_name="institution", max_length=100, blank=True
    )

    user = models.ForeignKey(
        to="auth.User", on_delete=models.CASCADE, related_name="accounts"
    )

    balance = MoneyField(
        verbose_name="balance", max_digits=10, decimal_places=2, default=0
    )

    initial_date = models.DateTimeField(
        verbose_name="starting balance date", default=now
    )

    icon = models.CharField(verbose_name="icon", max_length=100, blank=True)

    pos = models.PositiveSmallIntegerField(default=0, db_index=True)

    class Meta:
        verbose_name = "account"
        verbose_name_plural = "accounts"
        ordering = ("user", "pos", "name")

    def __str__(self):
        return f"{self.icon} {self.name}"

    def __repr__(self):
        return f"<Account(user={self.user!r}, name={self.name!r}, institution={self.institution!r}, balance={self.balance!r})>"

    def set_initial_balance(self, amount, save=True):
        self.initial_date = now()
        if save:
            self.save()
        self.transactions.create(user=self.user, is_initial=True, amount=amount)

    def set_pos(self, pos, save=True):
        if pos == self.pos:
            raise Exception("same pos")
        if pos > self.pos:
            self.user.accounts.filter(pos__gt=self.pos, pos__lte=pos).update(
                pos=F("pos") - 1
            )
        else:
            self.user.accounts.filter(pos__lt=self.pos, pos__gte=pos).update(
                pos=F("pos") + 1
            )

        self.pos = pos

        if save:
            self.save()

    def reconcile(self):
        """
        Recalculate the current account balance.
        """
        aggregate = self.transactions.filter(datetime__gte=self.initial_date).aggregate(
            Sum("amount")
        )
        if aggregate["amount__sum"]:
            self.balance = aggregate["amount__sum"]
            self.save()

    def transfer(self, *, to, amount, conversion_rate=1, text=None, datetime=None):
        if text is None:
            text = ""
        if datetime is None:
            datetime = now()

        with transaction.atomic():
            source_tx = self.transactions.create(
                user=self.user, amount=(amount * -1), text=text, datetime=datetime
            )
            target_tx = to.transactions.create(
                user=self.user,
                amount=amount * conversion_rate,
                text=text,
                reverse_transaction=source_tx,
                datetime=datetime,
            )
            source_tx.reverse_transaction = target_tx
            source_tx.save()
            return source_tx, target_tx
