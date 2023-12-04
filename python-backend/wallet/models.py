from utils.database import mongo_database
from market.models import Coin
from datetime import datetime

class Wallet():
    def __init__(self, coin, value):
        self.coin = coin
        self.value = value


class WalletTransaction():
    class TransactionType():
        CREDIT = 'CREDIT', 'Credit'
        DEBIT = 'DEBIT', 'Debit'

    def __init__(self, coin, value, transaction_type):
        self.coin = coin
        self.value = value
        self.transaction_type = transaction_type
        self.timestamp = datetime.now()

