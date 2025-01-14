from typing import Callable
import time
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets

# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator

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

from .utils import FIAT_OPTIONS

class ProfitExpectedMarginViewSet(viewsets.ModelViewSet):
    queryset = ProfitExpectedMargin.objects.all()
    serializer_class = ProfitExpectedMarginSerializer

class CurrencyAvailable(APIView):
    def get(self, request, *args, **kwargs):
        codes = Currency.objects.values_list("code", flat=True)
        availabel_options = set(FIAT_OPTIONS) - set(codes)
        return Response(availabel_options)

# @method_decorator(csrf_exempt, name='dispatch')
class CurrencyAPIListCreate(ListCreateAPIView):
    permission_classes = [AllowAny]
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
