from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import Transaction
from users.models import User


@method_decorator(csrf_exempt, name='dispatch')
class TransactionController(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            type = data.get('type')
            state = data.get('state')
            from_user = data.get('from_user')
            trade_amount = data.get('trade_amount')
            trade_price = data.get('trade_price')
            sell_coin = data.get('sell_coin')
            buy_coin = data.get('buy_coin')
            leverage = data.get('leverage')
            transaction_class = data.get('transaction_class')
            if not type or not state or not from_user or not trade_amount or not trade_price or not sell_coin or not buy_coin or not transaction_class or not leverage:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            # add margin and liquidation price
            transaction = Transaction(type, state, from_user, trade_amount,
                                      trade_price, sell_coin, buy_coin, transaction_class, leverage)
            return JsonResponse({'success': f'Transaction {transaction.type} created successfully'}, status=201)

        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)

    def get(self, request, *args, **kwargs):
        try:
            query_params = request.GET
            if query_params.get('user'):
                transactions = Transaction.get_user_all_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('all-active'):
                transactions = Transaction.get_all_active_transactions()
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('all-settled'):
                transactions = Transaction.get_all_settled_transactions()
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('all-expired'):
                transactions = Transaction.get_all_expired_transactions()
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('all'):
                transactions = Transaction.get_all_transactions()
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('user-active'):
                transactions = Transaction.get_user_active_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('user-settled'):
                transactions = Transaction.get_user_settled_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('user-market'):
                transactions = Transaction.get_user_market_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('user-limit'):
                transactions = Transaction.get_user_limit_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            elif query_params.get('user-expired'):
                transactions = Transaction.get_user_expired_transactions(
                    query_params.get('user'))
                return JsonResponse({'transactions': transactions}, status=200)
            else:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
        except Exception as error:
            return JsonResponse({'error': f'Error: {str(error)}'}, status=500)
