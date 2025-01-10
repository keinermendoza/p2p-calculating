from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from concurrent.futures import ThreadPoolExecutor

from core.p2p_api import (
    get_sell_rate_to_ves,
    get_buy_rate_to_ves,
    calculate_price,
    get_descount_using_porcentage,
    charge_margin_profit_using_porcentage,
)


def fetch_currency_rate(currency: str, api_call: Callable, **kwargs):
    return {currency: api_call(currency, **kwargs)}


class MonedasAPIView(APIView):
    permission_classes = [IsAuthenticated]
    currencies = ["COP", "BRL", "CLP", "PEN"]

    currency_filters = {
        "BRL": {
            "payTypes": ["Pix"],
            "transAmount": 100,
            "publisherType": None,
        },
        "COP": {},
        "CLP": {},
        "PEN": {},
    }

    def get(self, request, *args, **kwargs):
        initial_time = time.time()
        with ThreadPoolExecutor() as executor:
            venta_monedas_bolivares = list(
                executor.map(
                    lambda currency: get_sell_rate_to_ves(
                        currency,
                        decimals=3,
                        filters_origin_currency=self.currency_filters[currency],
                    ),
                    self.currencies,
                )
            )

            ves_sell = {}
            for i, currency in enumerate(venta_monedas_bolivares, 0):
                for key in ["ref", "ref_list", "ref_calc"]:
                    value = venta_monedas_bolivares[i].pop(key)
                    ves_sell.setdefault(key, value)

        with ThreadPoolExecutor() as executor2:
            compra_monedas_bolivares = list(
                executor2.map(
                    lambda currency: get_buy_rate_to_ves(
                        currency,
                        decimals=3,
                        filters_destination_currency=self.currency_filters[currency],
                    ),
                    self.currencies,
                )
            )

          

            ves_buy = {}
            for i, currency in enumerate(compra_monedas_bolivares, 0):
                for key in ["ref", "ref_list", "ref_calc"]:
                    value = compra_monedas_bolivares[i].pop(key)
                    ves_buy.setdefault(key, value)
                



        ending_time = time.time()
        response_time = ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "tasa de cambio de envio de monedas a VES": {
                    "primeras ordernes de venta sin anuncios": ves_buy["ref_list"],
                    "precio de referencia venta USDT en VES": ves_buy["ref"],
                    "precio de venta USDT con con margen VES":  ves_buy["ref_calc"],
                    "monedas": venta_monedas_bolivares,
                },
                "tasa de cambio de envio de VES a monedas": {
                    "primeras ordernes de compra sin anuncios": ves_sell["ref_list"],
                    "precio de referencia compra USDT en VES": ves_sell["ref"],
                    "precio de compra USDT con con margen VES": ves_sell["ref_calc"],
                    "monedas": compra_monedas_bolivares,
                },
            },
            status=status.HTTP_200_OK,
        )
