from typing import Iterable
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class UseTimeStamps(models.Model):
    created = models.DateTimeField("fecha de registro", auto_now_add=True)
    updated = models.DateTimeField("fecha de actualización", auto_now=True)
    modifier = models.CharField("Modificado por", max_length=100, blank=True)

    class Meta:
        abstract = True
        indexes = [models.Index(fields=["-created"])]


class Currency(UseTimeStamps):
    name = models.CharField("Moneda", max_length=100, unique=True)
    code = models.CharField("Código", max_length=4, unique=True)
    filters = models.JSONField("filtros", blank=True, default=dict)

    def __str__(self) -> str:
        return self.name


class SelectionCalculationPreferences(UseTimeStamps):

    profitMargin = models.DecimalField(
        "Margen de Ganáncia", decimal_places=2, max_digits=6, default=0.04
    )
    referencePricePosition = models.IntegerField(
        "Posición Precios de Referencia",
        default=3, validators=[MaxValueValidator(8), MinValueValidator(1)]
    )

    def save(self, *args, **kwargs) -> None:
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Preferencia {self.id} modificada el {self.updated}"
