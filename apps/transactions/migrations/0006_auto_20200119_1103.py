# Generated by Django 3.0.2 on 2020-01-19 11:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0005_transaction_is_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plannedtransaction',
            name='related',
            field=models.ForeignKey(blank=True, help_text='Reverse transaction to a transfer.', null=True, on_delete=django.db.models.deletion.CASCADE, to='transactions.PlannedTransaction'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='related',
            field=models.ForeignKey(blank=True, help_text='Reverse transaction to a transfer.', null=True, on_delete=django.db.models.deletion.CASCADE, to='transactions.Transaction'),
        ),
    ]
