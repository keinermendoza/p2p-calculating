from core.p2p_api import (
    get_buy_rate_to_ves,
    get_sell_rate_to_ves,
    calculate_price
)

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


    # cop = get_buy_rate_to_ves("COP", decimal_precision=8)
    # clp = get_buy_rate_to_ves("CLP", decimal_precision=8)
    # brl = get_buy_rate_to_ves("BRL", decimal_precision=8)
    # pen = get_buy_rate_to_ves("PEN", decimal_precision=8)

    # print("Has envíos a venezuela, mira nuestros precios")

    # print(f"{round(Decimal(cop * 100), 2)} Pesos Colombianos por 100 Bolivares")
    # print(f"{round(Decimal(clp * 100), 2)} Pesos Chilenos por 100 Bolivares")
    # print(f"{round(Decimal(brl * 100), 2)} Reales Brasileños por 100 Bolivares")
    # print(f"{round(Decimal(pen * 100), 2)} Soles Peruanos por 100 Bolivares")


    # VES_SELL = calculate_price("VES")
    # VES_SELL_2 = calculate_price("VES", use_adv_position=4, filters = {
    #     "payTypes":["BANK", "SpecificBanck"],
    #     "transAmount" :5000
    #     }
    # )

    # VES_SELL_3 = calculate_price(
    #     "VES",
    #     use_adv_position=3,
    #         filters={
    #             "transAmount":  5000,
    #             "payTypes": ["BANK", "SpecificBanck"],
    #         }
    #     )
    # print("precio promedio USDT en Bs a", VES_SELL_3)



    VES_SELL = get_sell_rate_to_ves("BRL", filters_origin_currency={
        "payTypes": ["Pix"],
        "transAmount": 100
    })

    print("precio promedio USDT en Bs a", VES_SELL)

    
    # print("precio de 4 posicion vender USDT en Bs a", VES_SELL_2)
    # print("precio de 4 posicion sin filtros vender USDT en Bs a", VES_SELL_3)

