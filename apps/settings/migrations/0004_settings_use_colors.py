# Generated by Django 3.0.2 on 2020-01-13 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings', '0003_settings_default_credit_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='settings',
            name='use_colors',
            field=models.BooleanField(default=True, verbose_name='colorize currency values?'),
        ),
    ]