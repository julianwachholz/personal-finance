# Generated by Django 3.0.1 on 2020-01-08 13:18

import django.contrib.postgres.fields.citext
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("tags", "0003_auto_20200104_1332")]

    operations = [
        migrations.AlterField(
            model_name="tag",
            name="name",
            field=django.contrib.postgres.fields.citext.CICharField(max_length=100),
        ),
    ]
