from django.urls import path
from django.urls import re_path
from .service import CoinController, PriceConsumer, OrderBookConsumer

urlpatterns = [
    path('coin/', CoinController.as_view(), name='coin'),
]
websocket_urlpatterns = [
    re_path(r"ws/price/", PriceConsumer.as_asgi()),
    re_path(r"ws/order/", OrderBookConsumer.as_asgi()),
]
