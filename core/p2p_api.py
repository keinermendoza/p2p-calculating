from typing import List, Dict, Tuple, Callable
from decimal import getcontext as decimal_getcontext, Decimal, ROUND_DOWN
from django.core.exceptions import ValidationError
import requests
from copy import copy
from concurrent.futures import ThreadPoolExecutor

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
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
}

SEARCH_API = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"


# https://stackoverflow.com/questions/67793326/api-binance-p2p-i-only-access-a-part-only-the-buy-and-not-all-of-it-buy-and-s
# https://github.com/n4t1412dev/binance-p2p-api/blob/main/src/BinanceApi/Binance.php

BASIC_PAYLOAD = {
    # "fiat": "VES",
    "page": 1,
    "rows": 10,
    # "transAmount": 5000,
    # "tradeType": "SELL",
    # "asset": "USDT",
    "countries": [],
    "proMerchantAds": False,
    "shieldMerchantAds": False,
    "filterType": "all",
    "periods": [],
    "additionalKycVerifyFilter": 0,
    "publisherType": "merchant",
    "payTypes": [],
    "classifies": ["mass", "profession", "fiat_trade"],
}


def get_prices(
    currency: str, trade_type: str = "SELL", asset: str = "USDT", **kwargs
) -> Dict[str, List[Decimal]]:
    """make request to p2p api and returns price list
    extra arguments are pass to the payload
    """

    payload = copy(BASIC_PAYLOAD)
    payload.update(
        {"tradeType": trade_type, "fiat": currency, "asset": asset, **kwargs}
    )

    response = requests.post(SEARCH_API, headers=HEADERS, json=payload)
    data = response.json()

    return {currency: [Decimal(adv["adv"]["price"]) for adv in data["data"]]}

    # if not prices[currency]:
    #     raise ValidationError("prices list is empty")
    # return prices 

def get_trade_methods(currency: str) -> List[str]:
    """Retrives the available trade Methods for a currency 
    """
    url = "https://p2p.binance.com/bapi/c2c/v2/public/c2c/adv/filter-conditions"
    payload = {
        "fiat": currency
    }
    resp = requests.post(url=url, json=payload)
    data = resp.json()
    return  [method["identifier"] for method in data["data"]["tradeMethods"]]


def get_positional_price(
    prices: List[Decimal], price_position: int, decimals: int = 2
) -> Decimal:
    # print(f"{price_position=}, {prices=}")
    if len(prices) < price_position:
        price_position = len(prices) 
    return round(Decimal(prices[price_position - 1]), decimals)
    

def get_exchange_rate(
    origin_currency_prices: List[Decimal],
    destination_currency_prices: List[Decimal],
    selection_method: Callable,
    margin_calculation_method: Callable,
    apply_margin_calculation_to_destination: bool = True,
    destination_selection_params: dict = {},
    origin_selection_params: dict = {},
    margin_calculation_params: dict = {},
    decimals: int = 3,
) -> dict:
    """executes selection and margin calculation callback functions
    calculates the rate and returns it in a dict with the selected prices
    for both currencies and the calculation amount
    """

    decimal_getcontext().rounding = ROUND_DOWN

    origin_reference_price = selection_method(
        origin_currency_prices, **origin_selection_params
    )
    destination_reference_price = selection_method(
        destination_currency_prices, **destination_selection_params
    )

    if apply_margin_calculation_to_destination:
        calculated_price = margin_calculation_method(
            destination_reference_price, **margin_calculation_params
        )

        rate = round(calculated_price / origin_reference_price, decimals)

    else:
        calculated_price = margin_calculation_method(
            origin_reference_price, **margin_calculation_params
        )

        rate = round(destination_reference_price / calculated_price, decimals)

    return {
        "rate": rate,
        "calculated_price": calculated_price,
        "destination_reference_price": destination_reference_price,
        "origin_reference_price": origin_reference_price,
    }


def get_descount_using_porcentage(
    amount: Decimal, profit_margin: float | Decimal = 0.05, decimals: int = 2
) -> Decimal:
    """returns the desconted price for currency using profit_margin

    profit_margin: number between 0.01 and 1
    decimal: precision decimals. will truncate extra decimals
    """

    full_price = 1
    price_with_decimals = amount * Decimal(full_price - profit_margin)

    decimal_getcontext().rounding = ROUND_DOWN
    return round(Decimal(price_with_decimals), decimals)


def charge_margin_profit_using_porcentage(
    amount: Decimal, profit_margin: float | Decimal = 0.05, decimals: int = 2
) -> Decimal:
    """returns the desconted price for currency using profit_margin

    profit_margin: number between 0.01 and 1
    decimal: precision decimals. will truncate extra decimals
    """

    full_price = 1
    price_with_decimals = amount * Decimal(full_price + profit_margin)

    decimal_getcontext().rounding = ROUND_DOWN
    return round(Decimal(price_with_decimals), decimals)


def get_rate_to_ves(
    origin_currency: str,
    origin_currency_prices: List[Decimal],
    destination_currency_prices: List[Decimal],
    selection_method: Callable = get_positional_price,
    margin_calculation_method: Callable = get_descount_using_porcentage,
    destination_currency: str = "VES",
    margin_calculation_params: dict = {},
    apply_margin_calculation_to_destination: bool = True,
    destination_selection_params: dict = {},
    origin_selection_params: dict = {},
    decimals: int = 3,
) -> dict:
    """Implementation of get_exchange_rate for Send money to VES"""


    if not origin_currency_prices or not destination_currency_prices:
        return {
            "origin_currency": origin_currency,
            "destination_currency": destination_currency,
            "origin_prices": [],
            "origin_reference_price": None,
            "destination_prices": [],
            "destination_reference_price": None,
            "calculated_price": None,
            "rate": None,
        # "profit_margin":profit_margin,
    }

    calculation: dict = get_exchange_rate(
        origin_currency_prices=origin_currency_prices,
        destination_currency_prices=destination_currency_prices,
        selection_method=selection_method,
        margin_calculation_method=margin_calculation_method,
        margin_calculation_params=margin_calculation_params,
        apply_margin_calculation_to_destination=apply_margin_calculation_to_destination,
        destination_selection_params=destination_selection_params,
        origin_selection_params=origin_selection_params,
        decimals=decimals,
    )

    # this is may not be thebest solution
    # profit_margin = margin_calculation_params["profit_margin"]


    return {
        "origin_currency": origin_currency,
        "destination_currency": destination_currency,
        "origin_prices": origin_currency_prices,
        "origin_reference_price": calculation["origin_reference_price"],
        "destination_prices": destination_currency_prices,
        "destination_reference_price": calculation["destination_reference_price"],
        "calculated_price": calculation["calculated_price"],
        # "profit_margin":profit_margin,
        "rate": calculation["rate"],
    }


def get_rate_from_ves(
    destination_currency: str,
    origin_currency_prices: List[Decimal],
    destination_currency_prices: List[Decimal],
    selection_method: Callable = get_positional_price,
    margin_calculation_method: Callable = charge_margin_profit_using_porcentage,
    margin_calculation_params: dict = {},
    origin_currency: str = "VES",
    apply_margin_calculation_to_destination: bool = False,
    destination_selection_params: dict = {},
    origin_selection_params: dict = {},
    decimals: int = 3,
) -> dict:
    """Implementation of get_exchange_rate for Send money to VES"""

    if not origin_currency_prices or not destination_currency_prices:
        return {
            "origin_currency": origin_currency,
            "destination_currency": destination_currency,
            "origin_prices": [],
            "origin_reference_price": None,
            "destination_prices": [],
            "destination_reference_price": None,
            "calculated_price": None,
            "rate": None,
        # "profit_margin":profit_margin,
        }

    calculation: dict = get_exchange_rate(
        origin_currency_prices=origin_currency_prices,
        destination_currency_prices=destination_currency_prices,
        selection_method=selection_method,
        margin_calculation_method=margin_calculation_method,
        margin_calculation_params=margin_calculation_params,
        apply_margin_calculation_to_destination=apply_margin_calculation_to_destination,
        destination_selection_params=destination_selection_params,
        origin_selection_params=origin_selection_params,
        decimals=decimals,
    )

    # profit_margin = margin_calculation_params["profit_margin"]


    return {
        "origin_currency": origin_currency,
        "destination_currency": destination_currency,
        "origin_prices": origin_currency_prices,
        "origin_reference_price": calculation["origin_reference_price"],
        "destination_prices": destination_currency_prices,
        "destination_reference_price": calculation["destination_reference_price"],
        "calculated_price": calculation["calculated_price"],
        "rate": calculation["rate"],
        # "profit_margin":profit_margin,
    }


def fetch_prices_thread_pool(operations, trade_type="SELL"):
    with ThreadPoolExecutor(max_workers=10) as executor:
        prices_list = list(
            executor.map(
                lambda currency: get_prices(
                    currency["code"], trade_type=trade_type, **currency["filters"]
                ),
                operations,
            )
        )

        return {k: v for d in prices_list for k, v in d.items()}
    

def get_multiple_rates_from_ves(
    ves_prices: List[Decimal],
    sell_prices: Dict[str, Decimal],
    selection_params: dict = {},
    margin_calculation_params: dict = {}

) -> List[dict]:
    """Implementation of get_rate_from_ves for multiple currencies
    sell_prices can include VES prices, this will be safetly ignored
    """
    rates_from_ves = []
    for code in sell_prices:
        if code != "VES":
            rates_from_ves.append(
                get_rate_from_ves(
                    destination_currency=code,
                    origin_currency_prices=ves_prices,
                    destination_currency_prices=sell_prices[code],
                    destination_selection_params=selection_params,
                    origin_selection_params=selection_params,
                    margin_calculation_params=margin_calculation_params
                )
            )
    return rates_from_ves


def get_multiple_rates_to_ves(
    ves_prices: List[Decimal],
    buy_prices: Dict[str, Decimal],
    selection_params: dict = {},
    margin_calculation_params: dict = {}

) -> List[dict]:
    """Implementation of get_rate_to_ves for multiple currencies
    buy_prices can include VES prices, this will be safetly ignored
    """
    rates_to_ves = []
    for code in buy_prices:
        if code != "VES":
            rates_to_ves.append(
                get_rate_to_ves(
                    origin_currency=code,
                    origin_currency_prices=buy_prices[code],
                    destination_currency_prices=ves_prices,
                    destination_selection_params=selection_params,
                    origin_selection_params=selection_params,
                    margin_calculation_params=margin_calculation_params
                )
            )
    return rates_to_ves
