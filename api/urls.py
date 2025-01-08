from django.urls import path 
from . import views

app_name = "api"

urlpatterns = [
    path('monedas/', views.MonedasAPIView.as_view(), name="monedas"),
]
