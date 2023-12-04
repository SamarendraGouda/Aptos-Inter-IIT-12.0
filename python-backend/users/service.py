from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import User, Wallet, WalletTransaction
from market.models import Coin


@method_decorator(csrf_exempt, name='dispatch')
class UserController(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            user_address = data.get('address')
            if not user_address:
                return JsonResponse({'error': 'Missing required field: address'}, status=400)
            user = User(user_address).add_user()
            return JsonResponse({'success': f'User {user.address} created successfully'}, status=201)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class WalletController(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            address = data.get('address')
            coin_symbol = data.get('coin_symbol')
            value = data.get('value')
            transaction_type = data.get('transaction_type')

            if not coin_symbol or not value or not transaction_type:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            transaction = User(address).transaction_wallet(
                coin_symbol, value, transaction_type)

            transaction_message = 'Debit' if transaction_type == WalletTransaction.TransactionType.DEBIT else 'Credit'
            return JsonResponse({'success': f'{transaction_message} transaction completed - {transaction}'}, status=200)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)

    def get(self, request, *args, **kwargs):
        try:
            user_address = request.GET.get('user_address')
            wallets = User(user_address).get_wallet()
            wallet_list = [{'coin': wallet.coin.name,
                            'value': wallet.value} for wallet in wallets]
            return JsonResponse({'wallets': wallet_list}, status=200)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class TransactionController(View):
    def get(self, request, *args, **kwargs):
        try:
            user_address = request.GET.get('user_address')
            transactions = User(user_address).transaction_history()
            transaction_list = [{'coin': transaction.coin.name, 'amount': transaction.amount,
                                 'type': transaction.type, 'timestamp': transaction.timestamp} for transaction in transactions]
            return JsonResponse({'transactions': transaction_list}, status=200)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)

