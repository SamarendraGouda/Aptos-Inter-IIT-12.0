from pymongo import MongoClient
from secrets import MONGO_URI


class Database:
    def __init__(self, uri):
        self.uri = uri
        self.client = MongoClient(self.uri)
        self.db = self.client.get_database()


mongo_database = Database(MONGO_URI)
