from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from core.p2p_api import (
    get_multiple_rates_from_ves,
    get_multiple_rates_to_ves,
    fetch_prices_thread_pool
)

class MonedasAPIView(APIView):
    permission_classes = [IsAuthenticated]
    operations = [
        {
            "code": "BRL",
            "filters": {
                "payTypes": ["Pix"],
                "transAmount": 100
            }
            
        },
        {
            "code": "VES",
            "filters": {
                "transAmount":  5000,
                "payTypes": ["BANK", "SpecificBanck"],
            }
        },
        {
            "code": "PEN",
            "filters": {}
        },
    ]

    def get(self, request, *args, **kwargs):
        initial_time = time.time()
        
        sell_prices = fetch_prices_thread_pool(self.operations)
        buy_prices = fetch_prices_thread_pool(self.operations, trade_type="BUY")

        rates_to_ves = get_multiple_rates_to_ves(ves_prices=sell_prices["VES"], buy_prices=buy_prices)
        rates_from_ves = get_multiple_rates_from_ves(ves_prices=buy_prices["VES"], sell_prices=sell_prices)


        ending_time = time.time()
        response_time = ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "rates_to_ves":rates_to_ves,
                "rates_from_ves": rates_from_ves,
            },
            status=status.HTTP_200_OK,
        )

        