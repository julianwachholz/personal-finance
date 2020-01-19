# Generated by Django 3.0.2 on 2020-01-18 16:23

from decimal import Decimal
from django.db import migrations
import djmoney.models.fields
import djmoney.models.validators


class Migration(migrations.Migration):

    dependencies = [
        ('budgets', '0002_auto_20200117_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budget',
            name='target',
            field=djmoney.models.fields.MoneyField(decimal_places=2, max_digits=10, validators=[djmoney.models.validators.MinMoneyValidator(Decimal('0.01'), message='Must be more than zero')], verbose_name='target amount'),
        ),
    ]
