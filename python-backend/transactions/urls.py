from django.urls import path
from .service import TransactionController

urlpatterns = [
    path('', TransactionController.as_view(), name='transaction'),
]
