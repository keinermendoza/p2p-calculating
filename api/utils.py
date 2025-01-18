from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import serializers, status
from typing import Callable

FIAT_OPTIONS = [
    "ARS",
    "EUR",
    "USD",
    "AED",
    "AUD",
    "BDT",
    "BHD",
    "BOB",
    "BRL",
    "CAD",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CZK",
    "DOP",
    "DZD",
    "EGP",
    "GBP",
    "GEL",
    "GHS",
    "HKD",
    "IDR",
    "INR",
    "JPY",
    "KES",
    "KHR",
    "KRW",
    "KWD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "MAD",
    "MMK",
    "MXN",
    "MYR",
    "NGN",
    "OMR",
    "PAB",
    "PEN",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RUB",
    "SAR",
    "SDG",
    "SEK",
    "SGD",
    "THB",
    "TND",
    "TRY",
    "TWD",
    "UAH",
    "UGX",
    "UYU",
    "VES",
    "VND",
    "ZAR",
]

def custom_error_format_response(errors_dict : dict):
    """reformating errors and return one level deep object json response 
    """
    new_error_dict = {}
    for field_name, field_errors in errors_dict.items():
        if isinstance(field_errors, dict):
            for n_field_name, n_field_errors in field_errors.items():
                if isinstance(n_field_errors, list):
                    new_error_dict[field_name] = n_field_errors[0]
                    break
                new_error_dict[field_name] =  field_errors[n_field_name]
                break
        else:
            new_error_dict[field_name] = field_errors[0]
    return Response({"errors": new_error_dict}, status=status.HTTP_400_BAD_REQUEST)


def default_response_or_custom_error(request: Request, handler: Callable,  *args, **kwargs) -> Response:
    """wrapper function for calling error formatting 
    """
    try:
        return handler(request, *args, **kwargs)
    except serializers.ValidationError as e:
        errors = e.detail 
        return custom_error_format_response(errors)
