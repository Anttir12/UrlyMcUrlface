# Generated by Django 4.1.5 on 2023-01-10 21:15

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('urls', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='urlyvisit',
            name='visited_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
