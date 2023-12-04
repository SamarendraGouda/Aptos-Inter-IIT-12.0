from django.db import models
from wallet.models import Wallet
from wallet.models import WalletTransaction
from datetime import datetime


class User(models.Model):
    address = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField()
    wallet = models.ManyToManyField(Wallet)
    wallet_history = models.ManyToManyField(WalletTransaction)

    def __str__(self):
        return f"User {self.address}"

    def add_user(user_address):
        try:
            existing_user = User.objects.filter(address=user_address).first()
            if existing_user:
                raise Exception("User already exists")
            user = User.objects.create(
                address=user_address,
                created_at=datetime.now(),
            )
            return user
        except Exception as error:
            print("Error adding user:", error)
            raise error

    def transaction_wallet(self, coin_instance, value, trasanction_type):
        try:
            existing_wallet = self.wallet.filter(coin=coin_instance).first()

            if trasanction_type == WalletTransaction.TransactionType.DEBIT:
                if existing_wallet:
                    existing_wallet.value -= value
                    existing_wallet.save()
                    return existing_wallet
                else:
                    raise Exception("Wallet not found")
            else:
                if existing_wallet:
                    existing_wallet.value += value
                    existing_wallet.save()
                    return existing_wallet
                else:
                    new_wallet = Wallet.objects.create(
                        coin=coin_instance, value=value)
                    self.wallet.add(new_wallet)
                    return new_wallet
        except Exception as error:
            print("Error updating wallet:", error)
            raise error

    def transaction_history(self):
        try:
            return self.wallet_history.all()
        except Exception as error:
            print("Error getting wallet history:", error)
            raise error

    def transaction_history_add(self, coin_instance, value, trasanction_type):
        try:
            new_transaction = WalletTransaction.objects.create(
                coin=coin_instance,
                amount=value,
                type=trasanction_type,
                timestamp=datetime.now(),
            )
            self.wallet_history.add(new_transaction)
            return new_transaction
        except Exception as error:
            print("Error adding wallet history:", error)
            raise error

    def get_wallet(self):
        try:
            return self.wallet.all()
        except Exception as error:
            print("Error getting wallet:", error)
            raise error
