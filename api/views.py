from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from concurrent.futures import ThreadPoolExecutor

from core.p2p_api import get_sell_rate_to_ves, get_buy_rate_to_ves

# # searched = "COP" # SI
# # searched = "BRL" # SI
# # searched = "CLP" # NO
# # searched = "VES" # NO
# # searched = "PEN" # NO

# class MonedasAPIView(APIView):
#     currencies = ["COP", "BRL", "CLP", "PEN"]
#     def get(self, request, *args, **kwargs):
#         initial_time = time.time()

#         sell_responses = []
#         buy_responses = []

#         for currency in self.currencies:

#             sell_exchange_rate = get_sell_rate_to_ves(currency)
#             sell_responses.append({currency:sell_exchange_rate})
            
#             buy_exchange_rate = get_buy_rate_to_ves(currency, decimal_precision=5)
#             buy_responses.append({currency:buy_exchange_rate})

#         ending_time = time.time()
#         response_time =  ending_time - initial_time

#         return Response({
#             "time": response_time,
#             "send_money_to_ves": sell_responses,
#             "recive_money_from_ves": buy_responses,
#         }, status=status.HTTP_200_OK)


def fetch_currency_rate(currency: str, api_call: Callable, **kwargs):
    return {currency: api_call(currency, **kwargs)}


class MonedasAPIView(APIView):
    permission_classes = [IsAuthenticated]
    currencies = ["COP", "BRL", "CLP", "PEN"]

    def get(self, request, *args, **kwargs):
        initial_time = time.time()
        with ThreadPoolExecutor() as executor:
            venta_monedas_bolivares = list(
                executor.map(
                    lambda currency: fetch_currency_rate(
                        currency, get_sell_rate_to_ves, decimal_precision=4
                    ),
                    self.currencies,
                )
            )

        with ThreadPoolExecutor() as executor2:
            compra_monedas_bolivares = list(
                executor2.map(
                    lambda currency: fetch_currency_rate(
                        currency, get_buy_rate_to_ves, decimal_precision=4
                    ),
                    self.currencies,
                )
            )
            
        ending_time = time.time()
        response_time =  ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "tasa de cambio de envio de monedas a VES": venta_monedas_bolivares,
                "tasa de cambio de envio de VES a monedas": compra_monedas_bolivares,
            },
            status=status.HTTP_200_OK,
        )
