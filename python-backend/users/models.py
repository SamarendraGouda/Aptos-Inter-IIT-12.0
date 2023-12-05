from wallet.models import Wallet
from wallet.models import WalletTransaction
from datetime import datetime
from utils.database import mongo_database
from market.models import Coin


class User:
    def __init__(self, address):
        self.address = address
        self.created_at = datetime.now()
        self.wallet = []
        self.wallet_history = []

    def add_user(self):
        try:
            existing_user = self.get_user()
            if existing_user:
                raise Exception("User already exists")
            else:
                mongo_database.db.users.insert_one({
                    'address': self.address,
                    'created_at': self.created_at,
                    'wallet': [],
                    'wallet_history': []
                })
                return self
        except Exception as error:
            print("Error adding user:", error)
            raise error

    def get_user(self):
        try:
            existing_user = mongo_database.db.users.find_one(
                {'address': self.address})
            if existing_user:
                return existing_user
            else:
                return None
        except Exception as error:
            print("Error getting user:", error)
            raise error

    def check_Wallet(existing_user, coin_instance):
        try:
            existing_wallet = existing_user['wallet']
            if existing_wallet:
                for wallet in existing_wallet:
                    if wallet['coin'] == coin_instance:
                        return wallet
            return None
        except Exception as error:
            print("Error checking wallet:", error)
            raise error

    def transaction_wallet(self, coin, value, transaction_type):
        try:
            existing_user = self.get_user()
            if existing_user:
                coin_instance = Coin(coin).get_coin()
                if not coin_instance:
                    raise Exception("Coin not found")
                existing_wallet = User.check_Wallet(
                    existing_user, coin_instance)
                if transaction_type == WalletTransaction.TransactionType.DEBIT:
                    if existing_wallet:
                        if float(existing_wallet['value']) >= float(value):
                            print("existing wallet",existing_wallet)
                            initial_value = float(existing_wallet['value'])
                            existing_wallet['value'] = initial_value - float(value)
                            mongo_database.db.users.update_one(
                                {'address': self.address,
                                    'wallet.coin': coin_instance},
                                {'$set': {
                                    'wallet.$.value': existing_wallet['value']}}
                            )
                            transaction = self.transaction_history_add(
                                coin_instance, value, transaction_type
                            )
                            return transaction
                        else:
                            raise Exception(
                                "Insufficient funds in wallet for transaction")
                    else:
                        raise Exception("Wallet not found")
                else:
                    if existing_wallet:
                        initial_value = float(existing_wallet['value'])
                        existing_wallet['value'] = initial_value + float(value)
                        mongo_database.db.users.update_one(
                            {'address': self.address, 'wallet.coin': coin_instance},
                            {'$set': {
                                'wallet.$.value': existing_wallet['value']}}
                        )
                        transaction = self.transaction_history_add(
                            coin_instance, value, transaction_type
                        )
                        return transaction
                    else:
                        new_wallet = Wallet(coin_instance, value).add_wallet()
                        mongo_database.db.users.update_one(
                            {'address': self.address}, {'$push': {'wallet': new_wallet}})
                        transaction = self.transaction_history_add(
                            coin_instance, value, transaction_type
                        )
                        return transaction
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error updating wallet:", error)
            raise error

    def transaction_history(self):
        try:
            existing_user = self.get_user()
            if existing_user:
                return mongo_database.db.users.find({'user': self.address})
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting wallet history:", error)
            raise error

    def transaction_history_add(self, coin_instance, value, transaction_type):
        try:
            existing_user = self.get_user()
            if existing_user:
                new_transaction = WalletTransaction(
                    coin_instance, value, transaction_type).add_transaction()
                mongo_database.db.users.update_one(
                    {'address': self.address}, {
                        '$push': {'wallet_history': new_transaction}}
                )
                return new_transaction
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error adding wallet history:", error)
            raise error

    def get_wallet(self):
        try:
            existing_user = self.get_user()
            if existing_user:
                return existing_user['wallet']
            else:
                raise Exception("User not found")
        except Exception as error:
            print("Error getting wallet:", error)
            raise error
