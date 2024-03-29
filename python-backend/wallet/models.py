from utils.database import mongo_database
from market.models import Coin
from datetime import datetime

class Wallet():
    def __init__(self, coin, value):
        self.coin = coin
        self.value = float(value)
    
    def add_wallet(self):
        return {
            'coin': self.coin,
            'value': self.value
        }

class WalletTransaction():
    class TransactionType():
        CREDIT = 'Credit'
        DEBIT = 'Debit'

    def __init__(self, coin, value, transaction_type):
        self.coin = coin
        self.value = float(value)
        self.transaction_type = transaction_type
        self.timestamp = datetime.now()

    def add_transaction(self):
        return {
            'coin': self.coin,
            'value': self.value,
            'transaction_type': self.transaction_type,
            'timestamp': self.timestamp
        }

