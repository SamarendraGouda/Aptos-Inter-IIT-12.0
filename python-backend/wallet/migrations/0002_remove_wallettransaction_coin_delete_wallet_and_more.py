# Generated by Django 4.2.7 on 2023-12-04 23:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_delete_user'),
        ('wallet', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wallettransaction',
            name='coin',
        ),
        migrations.DeleteModel(
            name='Wallet',
        ),
        migrations.DeleteModel(
            name='WalletTransaction',
        ),
    ]