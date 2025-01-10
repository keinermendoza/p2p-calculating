from django.urls import path, re_path
from django.urls import reverse_lazy
from . import views

app_name = "core"

urlpatterns = [
    path('', views.CustomRedirectView.as_view(), name="home"),
    path("entrar/", views.LoginView.as_view(), name='login'),
    path("salir/", views.simple_logout, name='logout'),
    re_path(r'^panel/.*$', views.DashboardView.as_view(), name="panel"),
]
