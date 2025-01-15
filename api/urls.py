from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
app_name = "api"

router = DefaultRouter()
router.register(r'profit-margin', views.ProfitExpectedMarginViewSet, basename='profit')

urlpatterns = [
    path('exchanges/', views.MonedasAPIView.as_view(), name="exchanges"),
    path('currencies/', views.CurrencyAPIListCreate.as_view(), name="currency_list"),
    path('currencies/available/', views.CurrencyAvailable.as_view(), name="currency_available"),
    path('currency/<int:pk>/', views.CurrencyAPIRUD.as_view(), name="currency_detail"),
    path('', include(router.urls)),
]
