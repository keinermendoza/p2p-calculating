from binance.client import Client
from django.conf import settings
import requests
import pprint
def run():
    # client = Client(settings.BINNACE_API_KEY, settings.BINNACE_SECRET_KEY)
    # info = client.get_account()
    # colombia = client.get_recent_trades(symbol="USDTCOP", limit=2)
    # brasil = client.get_recent_trades(symbol="USDTBRL", limit=2)
    # chile = client.get_recent_trades(symbol="USDTCLP", limit=2)
    

    # resp = client.get_c2c_trade_history(tradeType="BUY")
    
    # print(resp)
    
    
    # info = client.get_exchange_info()
    # symbols = info["symbols"] 

    # searched = "COP" # SI
    # searched = "BRL" # SI
    # searched = "CLP" # NO
    # searched = "VES" # NO
    # searched = "PEN" # NO

    # for symbol in symbols:
    #     if searched in symbol["symbol"]:
    #         print(symbol["symbol"]) 


    # body = {
    #     "asset": "USDT",
    #     "fiat": "NGN",
    #     "merchantCheck": True,
    #     "page": 1,
    #     "payTypes": ["BANK"],
    #     "publisherType": None,
    #     "rows": 20,
    #     "tradeType": "SELL",
    #     "transAmount":  "5000"
    # }

    # url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"
    # resp = requests.post(url, body)

    # print(resp.json())
    



    # headers = {
    #     "Accept": "*/*",
    #     "Accept-Encoding": "gzip, deflate, br",
    #     "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    #     "Cache-Control": "no-cache",
    #     "Connection": "keep-alive",
    #     "Content-Length": "123",
    #     "content-type": "application/json",
    #     "Host": "p2p.binance.com",
    #     "Origin": "https://p2p.binance.com",
    #     "Pragma": "no-cache",
    #     "TE": "Trailers",
    #     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
    # }

    # data = {
    #     "asset": "USDT",
    #     "fiat": "ARS",
    #     "merchantCheck": False,
    #     "page": 1,
    #     "payTypes": [],
    #     "publisherType": None,
    #     "rows": 50,
    #     "tradeType": "SELL"
    # }


    # r = requests.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', headers=headers, json=data)
    # print(r.text)




    headers = {
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

    data = {
        "asset": "USDT",
        "tradeType": "SELL",
        "fiat": "CLP",
        "transAmount":  0,
        "order": "",
        "page": 1,
        "rows": 20,
        "filterType": "all"
    }

    # data = {
    #     "asset": "USDT",
    #     # "fiat": "BRL",
    #     # "merchantCheck": False,
    #     # "page": 1,
    #     "payTypes": [],
    #     "publisherType": None,
    #     "rows": 50,
    #     "tradeType": "BUY"
    # }


    r = requests.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', headers=headers, json=data)

    data = r.json()
    advertisings = data["data"]

    # price_list = []
    # user_grade_list = []
    # for adv in advertisings:
    #     price_list.append(adv["adv"]["price"])
    #     user_grade_list.append(adv["advertiser"]["userGrade"])

    # print(price_list)
    # print(user_grade_list)
    # print(len(price_list))


    
    print(data)