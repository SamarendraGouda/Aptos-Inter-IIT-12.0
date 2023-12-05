from market.models import Coin
from users.models import User
from datetime import datetime
from utils.database import mongo_database
from wallet.models import WalletTransaction


class Transaction():
    class TransactionType():
        LONG = 'LONG', 'Long'
        SHORT = 'SHORT', 'Short'

    class TransactionClass():
        MARKET = 'MARKET', 'Market'
        LIMIT = 'LIMIT', 'Limit'

    class TransactionState():
        ACTIVE = 'ACTIVE', 'Active'
        SETTLED = 'SETTLED', 'Settled'
        EXPIRED = 'EXPIRED', 'Expired'

    def __init__(self, type, state, from_user, trade_amount, trade_price, sell_coin, buy_coin, liquidation_price, transaction_class, leverage, margin):
        self.type = type
        self.state = state
        self.from_user = from_user
        self.trade_amount = float(trade_amount)
        self.trade_price = float(trade_price)
        self.leverage = float(leverage)
        self.margin = float(margin)
        self.sell_coin = sell_coin
        self.buy_coin = buy_coin
        self.liquidation_price = float(liquidation_price)
        self.created_at = datetime.now()
        self.transaction_class = transaction_class

    def add_transaction(self):
        try:
            existing_user = User(self.from_user).get_user()
            if existing_user:
                sell_coin_instance = Coin(self.sell_coin).get_coin()
                existing_wallet = User.check_Wallet(
                    existing_user=existing_user, coin_instance=sell_coin_instance)
                if existing_wallet:
                    if float(existing_wallet['value']) >= float(self.margin):
                        existing_user.transaction_wallet(
                            sell_coin_instance, self.margin, WalletTransaction.TransactionType.DEBIT)
                        buy_coin_instance = Coin(self.buy_coin).get_coin()
                        mongo_database.db.transactions.insert_one({
                            'type': self.type,
                            'state': self.state,
                            'from_user': existing_user,
                            'trade_amount': self.trade_amount,
                            'trade_price': self.trade_price,
                            'sell_coin': sell_coin_instance,
                            'buy_coin': buy_coin_instance,
                            'created_at': self.created_at,
                            'transaction_class': self.transaction_class,
                            'liquadtion_price': self.liquidation_price
                        })
                        return self
                    else:
                        raise Exception(
                            "Insufficient funds in wallet for transaction")
                else:
                    raise Exception("Wallet not found")
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error adding transaction:", error)
            raise error

    def get_all_transactions():
        try:
            return mongo_database.db.transactions.find({})
        except Exception as error:
            print("Error getting all transactions:", error)
            raise error

    def get_all_active_transactions():
        try:
            return mongo_database.db.transactions.find({'state': 'ACTIVE'})
        except Exception as error:
            print("Error getting all active transactions:", error)
            raise error

    def get_all_settled_transactions():
        try:
            return mongo_database.db.transactions.find({'state': 'SETTLED'})
        except Exception as error:
            print("Error getting all settled transactions:", error)
            raise error

    def get_all_expired_transactions():
        try:
            return mongo_database.db.transactions.find({'state': 'EXPIRED'})
        except Exception as error:
            print("Error getting all expired transactions:", error)
            raise error

    def get_user_all_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user transactions:", error)
            raise error

    def get_user_active_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user, 'state': 'ACTIVE'})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user active transactions:", error)
            raise error

    def get_user_settled_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user, 'state': 'SETTLED'})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user settled transactions:", error)
            raise error

    def get_user_expired_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user, 'state': 'EXPIRED'})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user expired transactions:", error)
            raise error

    def get_user_market_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user, 'transaction_class': 'MARKET'})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user market transactions:", error)
            raise error

    def get_user_limit_transactions(user):
        try:
            existing_user = User(user).get_user()
            if existing_user:
                return mongo_database.db.transactions.find({'from_user': existing_user, 'transaction_class': 'LIMIT'})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting all user limit transactions:", error)
            raise error
