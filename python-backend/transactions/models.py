from django.db import models
from market.models import Coin
from users.models import User
from datetime import datetime


class Transaction(models.Model):
    class TransactionType(models.TextChoices):
        LONG = 'LONG', 'Long'
        SHORT = 'SHORT', 'Short'

    class TransactionClass(models.TextChoices):
        MARKET = 'MARKET', 'Market'
        LIMIT = 'LIMIT', 'Limit'

    class TransactionState(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        SETTLED = 'SETTLED', 'Settled'

    type = models.CharField(max_length=10, choices=TransactionType.choices)
    state = models.CharField(max_length=10, choices=TransactionState.choices)
    transaction_class = models.CharField(
        max_length=10, choices=TransactionClass.choices, default=TransactionClass.MARKET)
    from_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="from_user")
    trade_amount = models.DecimalField(max_digits=10, decimal_places=2)
    trade_price = models.DecimalField(max_digits=10, decimal_places=2)
    sell_coin = models.ForeignKey(
        Coin, on_delete=models.CASCADE, related_name="sell_coin")
    buy_coin = models.ForeignKey(
        Coin, on_delete=models.CASCADE, related_name="buy_coin")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} Transaction from {self.from_user} to {self.to_user}"

    def add_transaction(type, state, from_user, trade_amount, trade_price, sell_coin, buy_coin, transaction_class):
        try:
            transaction = Transaction.objects.create(
                type=type,
                state=state,
                from_user=from_user,
                trade_amount=trade_amount,
                trade_price=trade_price,
                sell_coin=sell_coin,
                buy_coin=buy_coin,
                created_at=datetime.now(),
                transaction_class=transaction_class
            )
            return transaction
        except Exception as error:
            print("Error adding transaction:", error)
            raise error

    def get_all_transactions():
        try:
            return Transaction.objects.all()
        except Exception as error:
            print("Error getting all transactions:", error)
            raise error

    def get_all_active_transactions():
        try:
            return Transaction.objects.filter(state='ACTIVE')
        except Exception as error:
            print("Error getting all active transactions:", error)
            raise error

    def get_all_settled_transactions():
        try:
            return Transaction.objects.filter(state='SETTLED')
        except Exception as error:
            print("Error getting all settled transactions:", error)
            raise error

    def get_user_all_transactions(user):
        try:
            return Transaction.objects.filter(from_user=user)
        except Exception as error:
            print("Error getting all user transactions:", error)
            raise error

    def get_user_active_transactions(user):
        try:
            return Transaction.objects.filter(from_user=user, state='ACTIVE')
        except Exception as error:
            print("Error getting all user active transactions:", error)
            raise error

    def get_user_settled_transactions(user):
        try:
            return Transaction.objects.filter(from_user=user, state='SETTLED')
        except Exception as error:
            print("Error getting all user settled transactions:", error)
            raise error

    def get_user_market_transactions(user):
        try:
            return Transaction.objects.filter(from_user=user, transaction_class='MARKET')
        except Exception as error:
            print("Error getting all user market transactions:", error)
            raise error

    def get_user_limit_transactions(user):
        try:
            return Transaction.objects.filter(from_user=user, transaction_class='LIMIT')
        except Exception as error:
            print("Error getting all user limit transactions:", error)
            raise error
