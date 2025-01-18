from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from core.models import (
    Currency,
    SelectionCalculationPreferences
)
from .utils import FIAT_OPTIONS
# https://www.django-rest-framework.org/api-guide/serializers/#accessing-the-initial-data-and-instance
# When passing data to a serializer instance, the unmodified data will be made available as .initial_data. 
# If the data keyword argument is not passed then the .initial_data attribute will not exist.

class RejectExtraFieldsSerializer(serializers.BaseSerializer):
    def validate(self, data):
        """Mark serializer as invalig when extra fields are present
        """
        if hasattr(self, 'initial_data'):
            unknown_keys = set(self.initial_data.keys()) - set(self.fields.keys())
            if unknown_keys:
                raise ValidationError(f"Got unknown fields: {unknown_keys}")
        return data
    

class CurrencyFiltersSerializer(RejectExtraFieldsSerializer, serializers.Serializer):
    payTypes = serializers.ListField(
        max_length=10,
        allow_empty=True,
        required=False,
        error_messages={
            "max_length": "payTypes acepta hasta 10 metodos.",
            "blank": "payTypes no puede estar vacía.",
        },
        child=serializers.CharField(
            max_length=25,
            allow_blank=False,
            error_messages={
                "max_length": "metodos de payTypes no pueden tener más de 25 caracteres",
                "allow_blank": "payTypes no puede contener cadenas vacías",
            }
        )
    )
    transAmount = serializers.IntegerField(
        required=False,  # No es obligatorio
        min_value=1,  # Si necesitas que sea mayor o igual a 0
        error_messages={
            "invalid": "transAmount debe ser un número entero.",
            "min_value": "transAmount debe ser mayor o igual a 0",
            "null": "transAmount no puede ser nulo."  # Este mensaje es opcional
        }
    )

class CurrencySerializer(RejectExtraFieldsSerializer, serializers.ModelSerializer):
    filters = CurrencyFiltersSerializer(
        required=False,
        error_messages={
            "invalid": "filters debe ser un diccionario"
        }
    )

    class Meta:
        model = Currency
        fields = "__all__"

    def validate_code(self, code):
        """check if the code is in the list of allowed codes 
        """
        if code not in FIAT_OPTIONS:
            raise serializers.ValidationError("Opcion inválida")
        return code

    def validate(self, data):
        """manually calling validate inside nested CurrencyFiltersSerializer
        validate is not being automatically called inside nested serializers
        """

        if hasattr(self, 'initial_data'):
            if 'filters' in self.initial_data:
                filters_serializer = CurrencyFiltersSerializer(data=self.initial_data["filters"])
                if not filters_serializer.is_valid():
                    raise serializers.ValidationError({"filters": filters_serializer.errors})

        return super().validate(data)




class ProfitExpectedMarginSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectionCalculationPreferences
        fields = '__all__'

    def validate(self, data):
        max_instancias = 1

        request = self.context.get('request')
        if request.method == "POST":
            if SelectionCalculationPreferences.objects.count() >= max_instancias:
                raise serializers.ValidationError(f"Solo se permiten {max_instancias} instancias de este modelo.")
        return super().validate(data)
    
    def validate_profitMargin(self, value):
        if value <= 0:
            raise serializers.ValidationError("No puede ser menor o igual que 0")
        return round(value / 100, 2)