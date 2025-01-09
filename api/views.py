from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from concurrent.futures import ThreadPoolExecutor

from core.p2p_api import get_sell_rate_to_ves, get_buy_rate_to_ves


def fetch_currency_rate(currency: str, api_call: Callable, **kwargs):
    return {currency: api_call(currency, **kwargs)}


class MonedasAPIView(APIView):
    permission_classes = [IsAuthenticated]
    # currencies = ["COP", "BRL", "CLP", "PEN"]
    currencies = ["BRL"]


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
