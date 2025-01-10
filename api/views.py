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
        "PEN": {}
    }


    def get(self, request, *args, **kwargs):
        initial_time = time.time()
        with ThreadPoolExecutor() as executor:
            venta_monedas_bolivares = list(
                executor.map(
                    lambda currency: get_sell_rate_to_ves(
                        currency,
                        decimals=3,
                        filters_origin_currency=self.currency_filters[currency]
                    ),
                    self.currencies,
                )
            )

            precio_venta_usdt_en_ves_future = executor.submit(
                calculate_price,
                "VES",
                decimals=3,
                use_adv_position=3,
                filters={
                    "payTypes":["SpecificBank","BANK"],
                    "transAmount" :5000
                },
            )
            precio_venta_usdt_en_ves, precios_venta_ves = precio_venta_usdt_en_ves_future.result()
            precio_venta_usdt_en_ves_con_margen = get_descount_using_porcentage(precio_venta_usdt_en_ves, 0.05, decimals=3)



        with ThreadPoolExecutor() as executor2:
            compra_monedas_bolivares = list(
                executor2.map(
                    lambda currency: get_buy_rate_to_ves(
                        currency,
                        decimals=3,
                        filters_destination_currency=self.currency_filters[currency]
                    ),
                    self.currencies,
                )
            )

            precio_compra_usdt_en_ves_future = executor2.submit(
                calculate_price,
                "VES",
                decimals=3,
                trade_type="BUY",
                use_adv_position=3,
                filters={
                    "payTypes":["SpecificBank","BANK"],
                    "transAmount" :5000,
                    # "publisherType": None,
                },
            )

            precio_compra_usdt_en_ves, precios_compra_ves = precio_compra_usdt_en_ves_future.result()
            precio_compra_usdt_en_ves_con_margen = charge_margin_profit_using_porcentage(precio_compra_usdt_en_ves, 0.05, decimals=3)


            
        ending_time = time.time()
        response_time =  ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "tasa de cambio de envio de monedas a VES": {
                    "primeras ordernes de venta sin anuncios": precios_venta_ves,
                    "precio de referencia venta USDT en VES": precio_venta_usdt_en_ves,
                    "precio de venta USDT con con margen VES": precio_venta_usdt_en_ves_con_margen,
                    "monedas": venta_monedas_bolivares
                },
                "tasa de cambio de envio de VES a monedas": {
                    "primeras ordernes de compra sin anuncios": precios_compra_ves,
                    "precio de referencia compra USDT en VES": precio_compra_usdt_en_ves,
                    "precio de compra USDT con con margen VES": precio_compra_usdt_en_ves_con_margen,
                    "monedas": compra_monedas_bolivares,
                }
            },
            status=status.HTTP_200_OK,
        )
