from django.db import models


class Coin(models.Model):
    name = models.CharField(max_length=255, unique=True)
    symbol = models.CharField(max_length=20, unique=True)
    address = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

    def add_coin(name, symbol, address):
        try:
            existing_coin = Coin.objects.filter(name=name).first()
            if existing_coin:
                raise Exception("Coin already exists")
            coin = Coin.objects.create(
                name=name,
                symbol=symbol,
                address=address,
            )
            return coin
        except Exception as error:
            print("Error adding coin:", error)
            raise error

    def get_all_coins():
        try:
            return Coin.objects.all()
        except Exception as error:
            print("Error getting all coins:", error)
            raise error

    def delete_coin(name):
        try:
            coin = Coin.objects.filter(name=name).first()
            coin.delete()
        except Exception as error:
            print("Error deleting coin:", error)
            raise error
