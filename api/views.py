from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.p2p_api import (
    get_multiple_rates_from_ves,
    get_multiple_rates_to_ves,
    fetch_prices_thread_pool,
)

from core.models import (
    Currency,
    ProfitExpectedMargin
)

from .serializers import (
    CurrencySerializer,
    ProfitExpectedMarginSerializer
)

class ProfitExpectedMarginViewSet(viewsets.ModelViewSet):
    queryset = ProfitExpectedMargin.objects.all()
    serializer_class = ProfitExpectedMarginSerializer

class CurrencyAPIListCreate(ListCreateAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

class CurrencyAPIRUD(RetrieveUpdateDestroyAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer


class MonedasAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        initial_time = time.time()

        currencies = Currency.objects.all()
        profit_margin = ProfitExpectedMargin.objects.first()
        
        porcentage = profit_margin.porcentage if profit_margin else 0.04 
        print(porcentage)
        serializer = CurrencySerializer(currencies, many=True)
        operations = serializer.data

        sell_prices = fetch_prices_thread_pool(operations)
        buy_prices = fetch_prices_thread_pool(operations, trade_type="BUY")

        rates_to_ves = get_multiple_rates_to_ves(
            ves_prices=sell_prices["VES"],
            buy_prices=buy_prices,
            margin_expected_profit=porcentage
        )
        rates_from_ves = get_multiple_rates_from_ves(
            ves_prices=buy_prices["VES"],
            sell_prices=sell_prices,
            margin_expected_profit=porcentage
        )


        ending_time = time.time()
        response_time = ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "rates_to_ves": rates_to_ves,
                "rates_from_ves": rates_from_ves,
                "profit_margin":porcentage * 100 
            },
            status=status.HTTP_200_OK,
        )
