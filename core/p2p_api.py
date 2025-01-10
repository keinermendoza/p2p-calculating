from typing import List, Dict, Tuple
import json
from decimal import (
    getcontext as decimal_getcontext,  
    Decimal,
    ROUND_DOWN
) 

import pprint
from binance.client import Client
from django.conf import settings
import requests
from statistics import mean
from copy import copy

# for know about decimal.getcontext
# https://stackoverflow.com/questions/8595973/truncate-to-three-decimals-in-python
# https://docs.python.org/3/library/decimal.html#context-objects


HEADERS = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Length": "123",
    "content-type": "application/json",
    "Host": "p2p.binance.com",
    "Origin": "https://p2p.binance.com",
    "Pragma": "no-cache",
    "TE": "Trailers",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
}

SEARCH_API = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search'


# https://stackoverflow.com/questions/67793326/api-binance-p2p-i-only-access-a-part-only-the-buy-and-not-all-of-it-buy-and-s
# https://github.com/n4t1412dev/binance-p2p-api/blob/main/src/BinanceApi/Binance.php

BASIC_PAYLOAD = {
    # "fiat": "VES",
    "page": 1,
    "rows": 10,
    # "transAmount": 5000,
    "tradeType": "SELL",
    # "asset": "USDT",
    "countries": [],
    "proMerchantAds": False,
    "shieldMerchantAds": False,
    "filterType": "all",
    "periods": [],
    "additionalKycVerifyFilter": 0,
    "publisherType": "merchant",
    "payTypes": [],
    "classifies": [
        "mass",
        "profession",
        "fiat_trade"
    ]
}


def get_prices(
    currency: str,
    trade_type: str = "SELL",
    asset: str = "USDT",
    **kwargs
) -> List[float]:
    
    """make request to p2p api and returns price list
    extra arguments are pass to the payload
    """
    
    payload = copy(BASIC_PAYLOAD)
    payload.update({
        "tradeType": trade_type,
        "fiat": currency,
        "asset": asset,
        **kwargs
    })

    print(payload)

    response = requests.post(SEARCH_API, headers=HEADERS, json=payload)
    data = response.json()

    return  [float(adv["adv"]["price"]) for adv in data["data"]]


def calculate_price(
    currency: str,
    trade_type: str = "SELL",
    asset: str = "USDT",
    decimals: int = 3,
    use_adv_position: int | None = None,
    avg_exclude_border_pos: int | None = None,
    filters: dict = {}
) -> Decimal:
    
    """returns average price for currency trade_type. 
    can exclude border positions (min and max prices).
    also can return especific adv position price instead if use_adv_position is provided.

    uses de get_prices api call for retrive de price list,
    extra arguments are passed to the get_prices api call

    useful filters

    payTypes: List[str], # ["BANK", "Banesco", "PagoMovil", "SpecificBanck"]
    transAmount: str | int,
    
    """

    prices = get_prices(
        currency=currency,
        trade_type=trade_type,
        asset=asset,
        **filters
    )
    print(currency, trade_type, prices)

    # if use_adv_position:
    return round(Decimal(prices[use_adv_position - 1]), decimals)
    
    # else:
    #     if avg_exclude_border_pos:
    #         index = avg_exclude_border_pos -1 
    #         prices = prices[index:-index]


    #     avg_price = Decimal(mean(prices))
    #     return round(avg_price, decimals)



def get_descount_using_porcentage(
    amount: Decimal,
    descount :float = 0.05,
    decimals: int = 2
) -> Decimal:
    
    """returns the desconted price for currency using descount
    
    descount: number between 0.01 and 1
    decimal: precision decimals. will truncate extra decimals 
    """

    full_price = 1
    price_with_decimals =  amount * Decimal(full_price - descount)
     
    decimal_getcontext().rounding = ROUND_DOWN
    return round(Decimal(price_with_decimals), decimals)

def charge_margin_profit_using_porcentage(
    amount: Decimal,
    margin_profit :float = 0.05,
    decimals: int = 2
) -> Decimal:
    
    """returns the desconted price for currency using descount
    
    descount: number between 0.01 and 1
    decimal: precision decimals. will truncate extra decimals 
    """

    full_price = 1
    price_with_decimals =  amount * Decimal(full_price + margin_profit)
     
    decimal_getcontext().rounding = ROUND_DOWN
    return round(Decimal(price_with_decimals), decimals)


def get_sell_rate_to_ves(
    origin_currency: str,
    decimals: int = 3,
    profit_margin: float = 0.05,
    filters_origin_currency: dict = {},

    filters_ves: dict = {
        "payTypes":["BANK", "SpecificBanck"],
        "transAmount" :5000
    },
) -> dict[str, str | Decimal]:
    
    """useful filters

    payTypes: List[str], # ["BANK", "Banesco", "PagoMovil", "SpecificBanck"]
    transAmount: str | int,
    """

    decimal_getcontext().rounding = ROUND_DOWN
    
    # valor promedio de VENDER un USDT en Bs
    usdt_ves_sell = calculate_price(
        "VES",
        decimals=decimals,
        filters=filters_ves,
        use_adv_position=3
    )

    # valor de descontado VENDER de un USDT en Bs
    discounted_usdt_ves_sell = get_descount_using_porcentage(
        usdt_ves_sell,
        profit_margin,
        decimals=decimals
    ) 
    
    # valor promedio de COMPRAR un USDT en base_currency
    origin_currency_usdt_buy = calculate_price(
        origin_currency,
        trade_type="BUY",
        decimals=decimals,
        filters=filters_origin_currency,
        use_adv_position=3

    ) 
    
    # valor de cambio de base_currency a Bolivares
    origin_currency_ves_sell = round(
        discounted_usdt_ves_sell / origin_currency_usdt_buy,
        decimals
    )

    return {
        "moneda": origin_currency,
        "precio de referencia venta VES (se repite)": usdt_ves_sell,
        "precio de venta con margen VES (se repite)": discounted_usdt_ves_sell,
        f"precio de referencia compra {origin_currency}": origin_currency_usdt_buy,
        "tasa de cambio final": origin_currency_ves_sell,
        "Calculo usó filtros": "Si, para ambas monedas" if filters_origin_currency else "No, solo para VES"
    }



def get_buy_rate_to_ves(
    destination_currency: str,
    decimals: int = 3,
    profit_margin: float = 0.05,
    filters_destination_currency: dict = {},
    filters_ves: dict = {
        "payTypes":["BANK", "SpecificBanck"],
        "transAmount" :5000
    },
) -> dict[str, str | Decimal]:
    
    """useful filters

    payTypes: List[str], # ["BANK", "Banesco", "PagoMovil", "SpecificBanck"]
    transAmount: str | int,
    """

    decimal_getcontext().rounding = ROUND_DOWN
    
    # valor promedio de COMPRAR un USDT en Bs
    usdt_ves_buy = calculate_price(
        "VES",
        trade_type="BUY",
        decimals=decimals,
        filters=filters_ves,
        use_adv_position=3
    )

    # valor recargado de COMPRAR de un USDT en Bs
    usdt_ves_buy_charged = charge_margin_profit_using_porcentage(
        usdt_ves_buy,
        profit_margin,
        decimals=decimals
    ) 
    
    # valor promedio de VENDER un USDT en destination_currency
    destination_currency_usdt_sell = calculate_price(
        destination_currency,
        decimals=decimals,
        filters=filters_destination_currency,
        use_adv_position=3

    ) 
    
    # valor de cambio de destination_currency a Bolivares
    destination_currency_ves_buy = round(
        destination_currency_usdt_sell / usdt_ves_buy_charged,
        decimals
    )

    return {
        "moneda": destination_currency,
        "precio de referencia compra VES (se repite)": usdt_ves_buy,
        "precio de compra con margen VES (se repite)": usdt_ves_buy_charged,
        f"precio de referencia venta {destination_currency}": destination_currency_usdt_sell,
        "tasa de cambio final": destination_currency_ves_buy,
        "Calculo usó filtros": "Si, para ambas monedas" if filters_destination_currency else "No, solo para VES"
    }
