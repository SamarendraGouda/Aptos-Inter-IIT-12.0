from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import Coin


@method_decorator(csrf_exempt, name='dispatch')
class CoinController(View):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            action = data.get('action')
            if action == 'add':
                name = data.get('name')
                symbol = data.get('symbol')
                address = data.get('address')

                if not name or not symbol or not address:
                    return JsonResponse({'error': 'Missing required fields'}, status=400)

                coin = Coin.add_coin(name=name, symbol=symbol, address=address)
                return JsonResponse({'success': f'Coin {coin.name} created successfully'}, status=201)

            elif action == 'delete':
                name = data.get('name')
                if not name:
                    return JsonResponse({'error': 'Missing required fields'}, status=400)

                Coin.delete_coin(name)
                return JsonResponse({'success': f'Coin {name} deleted successfully'}, status=200)

        except Exception as error:
            return JsonResponse({'error': f'Error deleting coin: {str(error)}'}, status=500)

    def get(self, request, *args, **kwargs) :
        try:
            coins = Coin.get_all_coins()
            coin_list = [{'name': coin.name, 'symbol': coin.symbol,
                          'address': coin.address} for coin in coins]
            return JsonResponse({'coins': coin_list}, status=200)

        except Exception as error:
            return JsonResponse({'error': f'Error getting all coins: {str(error)}'}, status=500)
