from django.urls import path
from .service import CoinController

urlpatterns = [
    path('coin/', CoinController.as_view(), name='coin'),
]
