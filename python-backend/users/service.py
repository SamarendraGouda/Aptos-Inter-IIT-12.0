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
            action = data.get('action')

            if action == 'add':
                user_address = data.get('address')
                if not user_address:
                    return JsonResponse({'error': 'Missing required field: address'}, status=400)

                user = User.add_user(user_address)
                return JsonResponse({'success': f'User {user.address} created successfully'}, status=201)

            else:
                return JsonResponse({'error': 'Invalid action'}, status=400)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class WalletController(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            coin_symbol = data.get('coin_symbol')
            value = data.get('value')
            transaction_type = data.get('transaction_type')

            if not coin_symbol or not value or not transaction_type:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            user = User.objects.get(address=data.get('user_address'))
            coin_instance = Coin.objects.get(symbol=coin_symbol)

            wallet = user.transaction_wallet(
                coin_instance, value, transaction_type)

            transaction_message = 'Debit' if transaction_type == WalletTransaction.TransactionType.DEBIT else 'Credit'
            return JsonResponse({'success': f'{transaction_message} transaction completed. New wallet value: {wallet.value}'}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        except Wallet.DoesNotExist:
            return JsonResponse({'error': 'Wallet not found'}, status=404)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)

    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(address=request.GET.get('user_address'))
            wallets = user.wallet.all()
            wallet_list = [{'coin': wallet.coin.name,
                            'value': wallet.value} for wallet in wallets]
            return JsonResponse({'wallets': wallet_list}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class TransactionController(View):
    def get(self, request, *args, **kwargs):
        try:
            user = User.objects.get(address=request.GET.get('user_address'))
            transactions = user.transaction_history()
            transaction_list = [{'coin': transaction.coin.name, 'amount': transaction.amount,
                                 'type': transaction.type, 'timestamp': transaction.timestamp} for transaction in transactions]
            return JsonResponse({'transactions': transaction_list}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            coin_symbol = data.get('coin_symbol')
            value = data.get('value')
            transaction_type = data.get('transaction_type')

            if not coin_symbol or not value or not transaction_type:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            user = User.objects.get(address=data.get('user_address'))
            coin_instance = Coin.objects.get(symbol=coin_symbol)

            wallet = user.transaction_wallet(
                coin_instance, value, transaction_type)
            user.transaction_history_add(
                coin_instance, value, transaction_type)

            transaction_message = 'Debit' if transaction_type == WalletTransaction.TransactionType.DEBIT else 'Credit'
            return JsonResponse({'success': f'{transaction_message} transaction completed. New wallet value: {wallet.value}'}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        except Wallet.DoesNotExist:
            return JsonResponse({'error': 'Wallet not found'}, status=404)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)
