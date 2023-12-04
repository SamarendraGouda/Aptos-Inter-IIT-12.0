from utils.database import mongo_database
class Coin():
    def __init__(self, name=None, symbol=None, address=None):
        self.name = name
        self.symbol = symbol
        self.address = address

    def get_coin(self):
        try:
            existing_coin = mongo_database.db.coins.find_one(
                {'name': self.name})
            if existing_coin:
                return existing_coin
            else:
                raise Exception("Coin not found")
        except Exception as error:
            print("Error getting coin:", error)
            raise error

    def add_coin(self):
        try:
            existing_coin = mongo_database.db.coins.find_one(
                {'symbol': self.symbol})
            if existing_coin:
                raise Exception("Coin already exists")
            else:
                mongo_database.db.coins.insert_one({
                    'name': self.name,
                    'symbol': self.symbol,
                    'address': self.address
                })
            return self
        
        except Exception as error:
            print("Error adding coin:", error)
            raise error

    def get_all_coins():
        try:
            coins = mongo_database.db.coins.find({})
            return coins
        except Exception as error:
            print("Error getting coins:", error)
            raise error

    def delete_coin(self):
        try:
            existing_coin = mongo_database.db.coins.find_one(
                {'name': self.name})
            if existing_coin:
                mongo_database.db.coins.delete_one(
                    {'name': self.name})
            else:
                raise Exception("Coin not found")
            return self
        except Exception as error:
            print("Error deleting coin:", error)
            raise error
