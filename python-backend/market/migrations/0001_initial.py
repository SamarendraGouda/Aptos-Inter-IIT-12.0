# Generated by Django 4.2.7 on 2023-12-04 09:54

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Coin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('symbol', models.CharField(max_length=20, unique=True)),
                ('address', models.CharField(max_length=255, unique=True)),
            ],
        ),
    ]
