# Generated by Django 3.0.1 on 2019-12-30 23:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_account_balance_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='account',
            old_name='balance_date',
            new_name='initial_date',
        ),
    ]