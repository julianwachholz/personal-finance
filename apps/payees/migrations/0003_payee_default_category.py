# Generated by Django 3.0.1 on 2020-01-04 13:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0004_auto_20200104_1332'),
        ('payees', '0002_payee_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='payee',
            name='default_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='categories.Category'),
        ),
    ]