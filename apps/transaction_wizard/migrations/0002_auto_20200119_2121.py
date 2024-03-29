# Generated by Django 3.0.2 on 2020-01-19 21:21

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('transaction_wizard', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='importfile',
            name='type',
            field=models.CharField(editable=False, max_length=100),
        ),
        migrations.CreateModel(
            name='ImportConfig',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_type', models.CharField(max_length=100, verbose_name='file type')),
                ('last_use', models.DateTimeField(null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'import config',
                'verbose_name_plural': 'import configs',
            },
        ),
        migrations.CreateModel(
            name='ColumnMapping',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target', models.CharField(choices=[('datetime', 'Date / time'), ('account', 'Account'), ('amount', 'Amount'), ('category', 'Category'), ('text', 'Text'), ('payee', 'Payee'), ('tags', 'Tags'), ('reference', 'Reference')], max_length=255)),
                ('is_sourced', models.BooleanField(default=True, verbose_name='get value from source file?')),
                ('source', models.CharField(blank=True, max_length=255)),
                ('options', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mappings', to='transaction_wizard.ImportConfig')),
            ],
            options={
                'verbose_name': 'column mapping',
                'verbose_name_plural': 'column mappings',
                'unique_together': {('config', 'target')},
            },
        ),
    ]
