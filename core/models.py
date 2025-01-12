from django.db import models
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
    name = models.CharField("Moneda", max_length=100)
    code = models.CharField("Código", max_length=4)
    filters = models.JSONField("filtros", blank=True, default=dict)

    def __str__(self) -> str:
        return self.name
    
class ProfitExpectedMargin(UseTimeStamps):
    porcentage = models.DecimalField("Margen", decimal_places=2, max_digits=3)

    def __str__(self) -> str:
        return str(self.porcentage)
    

 