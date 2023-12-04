from pymongo import MongoClient
from .secrets import MONGO_URI


class Database:
    def __init__(self, uri):
        self.uri = uri
        self.client = MongoClient(self.uri)
        self.db = self.client['futures']


mongo_database = Database(MONGO_URI)
