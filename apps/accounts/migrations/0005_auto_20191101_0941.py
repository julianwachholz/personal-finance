# Generated by Django 2.2.5 on 2019-11-01 09:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_auto_20191023_1258"),
    ]

    operations = [
        migrations.RemoveField(model_name="account", name="is_default_credit",),
        migrations.RemoveField(model_name="account", name="is_default_debit",),
    ]
