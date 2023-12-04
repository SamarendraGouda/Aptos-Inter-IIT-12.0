from django.urls import path
from .service import UserController, WalletController, TransactionController

urlpatterns = [
    path('', UserController.as_view(), name='user'),
    path('wallet/', WalletController.as_view(), name='wallet'),
    path('transaction/', TransactionController.as_view(), name='transaction'),
]