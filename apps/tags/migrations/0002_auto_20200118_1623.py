# Generated by Django 3.0.2 on 2020-01-18 16:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tags', '0001_initial_squashed_0007_auto_20200117_2144'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='tag',
            options={'verbose_name': 'tag', 'verbose_name_plural': 'tags'},
        ),
    ]