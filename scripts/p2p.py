from typing import List, Dict, Tuple
from decimal import (
    getcontext as decimal_getcontext,  
    Decimal,
    ROUND_DOWN
) 

from binance.client import Client
from django.conf import settings
import requests
from statistics import mean
from copy import copy

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

BASIC_PAYLOAD = {
    "transAmount":  0,
    "order": "",
    "page": 1,
    "rows": 20,
    "filterType": "all"
}


def get_average_price(
    currency: str,
    trade_type: str = "SELL",
    asset: str = "USDT",
    decimals: int = 2
) -> Decimal:
    
    """make request to p2p api and returns average price
    """
    
    payload = copy(BASIC_PAYLOAD)
    payload.update({
        "tradeType": trade_type,
        "fiat": currency,
        "asset": asset
    })

    response = requests.post(SEARCH_API, headers=HEADERS, json=payload)
    data = response.json()
    advertisings = data["data"]

    prices = []
    for adv in advertisings:
        prices.append(float(adv["adv"]["price"]))

    avg_price = Decimal(mean(prices))
    return round(avg_price, decimals)

def get_descount_using_porcentage(
    amount: Decimal,
    descount :float = 0.05,
    decimals: int = 2
) -> float:
    
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
) -> float:
    
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
    decimal_precision: int = 2,
    profit_margin: float = 0.05 
):
    """
    https://stackoverflow.com/questions/8595973/truncate-to-three-decimals-in-python
    https://docs.python.org/3/library/decimal.html#context-objects
   
    """

    decimal_getcontext().rounding = ROUND_DOWN
    
    # valor promedio de VENDER un USDT en Bs
    usdt_ves_sell = get_average_price(
        "VES",
        decimals=decimal_precision
    )

    # valor de descontado VENDER de un USDT en Bs
    discounted_usdt_ves_sell = get_descount_using_porcentage(
        usdt_ves_sell,
        profit_margin,
        decimals=decimal_precision
    ) 
    
    # valor promedio de COMPRAR un USDT en base_currency
    origin_currency_usdt_buy = get_average_price(
        origin_currency,
        trade_type="BUY",
        decimals=decimal_precision
    ) 
    
    # valor de cambio de base_currency a Bolivares
    origin_currency_ves_sell = round(
        discounted_usdt_ves_sell / origin_currency_usdt_buy,
        decimal_precision
    )

    return origin_currency_ves_sell



def get_buy_rate_to_ves(
    destination_currency: str,
    decimal_precision: int = 2,
    profit_margin: float = 0.05 
):
    """
    https://stackoverflow.com/questions/8595973/truncate-to-three-decimals-in-python
    https://docs.python.org/3/library/decimal.html#context-objects
   
    """

    decimal_getcontext().rounding = ROUND_DOWN
    
    # valor promedio de COMPRAR un USDT en Bs
    usdt_ves_buy = get_average_price(
        "VES",
        trade_type="BUY",
        decimals=decimal_precision
    )

    # valor recargado de COMPRAR de un USDT en Bs
    usdt_ves_buy_charged = charge_margin_profit_using_porcentage(
        usdt_ves_buy,
        profit_margin,
        decimals=decimal_precision
    ) 
    
    # valor promedio de VENDER un USDT en destination_currency
    destination_currency_usdt_sell = get_average_price(
        destination_currency,
        decimals=decimal_precision
    ) 
    
    # valor de cambio de destination_currency a Bolivares
    destination_currency_ves_buy = round(
        destination_currency_usdt_sell / usdt_ves_buy_charged,
        decimal_precision
    )

    return destination_currency_ves_buy

def run():

    # # searched = "COP" # SI
    # # searched = "BRL" # SI
    # # searched = "CLP" # NO
    # # searched = "VES" # NO
    # # searched = "PEN" # NO

    # cop = get_sell_rate_to_ves("COP", decimal_precision=5)
    # clp = get_sell_rate_to_ves("CLP", decimal_precision=5)
    # brl = get_sell_rate_to_ves("BRL")
    # pen = get_sell_rate_to_ves("PEN")

    # print("Has envíos a venezuela, mira nuestros precios")

    # print(f"{round(Decimal(cop * 1000), 2)} Bs por 1000 Pesos Colombiano")
    # print(f"{round(Decimal(clp * 1000), 2)} Bs por 1000 Pesos Chileno")
    # print(f"{brl} Bs por 1 Real Brasileño")
    # print(f"{pen} Bs por 1 Sol Peruano")


    cop = get_buy_rate_to_ves("COP", decimal_precision=8)
    clp = get_buy_rate_to_ves("CLP", decimal_precision=8)
    brl = get_buy_rate_to_ves("BRL", decimal_precision=8)
    pen = get_buy_rate_to_ves("PEN", decimal_precision=8)

    print("Has envíos a venezuela, mira nuestros precios")

    print(f"{round(Decimal(cop * 100), 2)} Pesos Colombianos por 100 Bolivares")
    print(f"{round(Decimal(clp * 100), 2)} Pesos Chilenos por 100 Bolivares")
    print(f"{round(Decimal(brl * 100), 2)} Reales Brasileños por 100 Bolivares")
    print(f"{round(Decimal(pen * 100), 2)} Soles Peruanos por 100 Bolivares")



