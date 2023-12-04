from django.db import models
from market.models import Coin

class Wallet(models.Model):
    coin = models.ForeignKey(Coin, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.coin.name} Wallet"


class WalletTransaction(models.Model):
    class TransactionType(models.TextChoices):
        CREDIT = 'CREDIT', 'Credit'
        DEBIT = 'DEBIT', 'Debit'

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    coin = models.ForeignKey(Coin, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=TransactionType.choices)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} {self.amount} {self.coin.name} Transaction"
