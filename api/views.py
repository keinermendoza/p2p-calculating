import time
import logging

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework import (
    status,
    viewsets
)

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from core.p2p_api import (
    get_multiple_rates_from_ves,
    get_multiple_rates_to_ves,
    fetch_prices_thread_pool,
    get_trade_methods
)

from core.models import (
    Currency,
    SelectionCalculationPreferences
)

from .serializers import (
    CurrencySerializer,
    ProfitExpectedMarginSerializer
)

from .utils import (
    FIAT_OPTIONS,
    default_response_or_custom_error
)


logger = logging.getLogger(__name__)


class ProfitExpectedMarginViewSet(viewsets.ModelViewSet):
    queryset = SelectionCalculationPreferences.objects.all()
    serializer_class = ProfitExpectedMarginSerializer

    def list(self, request):
        object = self.queryset.first()
        serializer = self.serializer_class(object)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().create, *args,**kwargs)
    
    def update(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().update, *args,**kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().partial_update, *args, **kwargs)

class CurrencyAvailable(APIView):
    def get(self, request, *args, **kwargs):
        codes = Currency.objects.values_list("code", flat=True)
        availabel_options = set(FIAT_OPTIONS) - set(codes)
        return Response(availabel_options)

class CurrencyAPIListCreate(ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def create(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().create, *args,**kwargs)


class CurrencyAPIRUD(RetrieveUpdateDestroyAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def retrieve(self, request, *args, **kwargs):
        """calling binance for retrive available trade_methods
        """
        instance = self.get_object()
        trade_methods = get_trade_methods(instance.code)
        serializer = self.get_serializer(instance)
        return Response({
            "tradeMethods":trade_methods,
            "currency" :serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().update, *args,**kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        return default_response_or_custom_error(request, super().partial_update, *args, **kwargs)

class MonedasAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logger.info(f"user {request.user.id} that is admin requested info")
        initial_time = time.time()

        currencies = Currency.objects.all()
        preferences = SelectionCalculationPreferences.objects.first()
        
        serializer = CurrencySerializer(currencies, many=True)
        operations = serializer.data

        sell_prices = fetch_prices_thread_pool(operations)
        buy_prices = fetch_prices_thread_pool(operations, trade_type="BUY")

        rates_to_ves = get_multiple_rates_to_ves(
            ves_prices=sell_prices["VES"],
            buy_prices=buy_prices,
            margin_calculation_params={"profit_margin":preferences.profitMargin},
            selection_params={"price_position":preferences.referencePricePosition}
        )

        rates_from_ves = get_multiple_rates_from_ves(
            ves_prices=buy_prices["VES"],
            sell_prices=sell_prices,
            margin_calculation_params={"profit_margin":preferences.profitMargin},
            selection_params={"price_position":preferences.referencePricePosition}
        )


        ending_time = time.time()
        response_time = ending_time - initial_time
        return Response(
            {
                "time": response_time,
                "rates_to_ves": rates_to_ves,
                "rates_from_ves": rates_from_ves,
                "profit_margin":preferences.profitMargin * 100,
                "selected_position":preferences.referencePricePosition 
            },
            status=status.HTTP_200_OK,
        )
