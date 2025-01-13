from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.contrib.auth import logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (
    View,
    TemplateView
)


from django.contrib.auth.views import (
    LoginView as BaseLoginView,
)

from .forms import (
    LoginUserForm,
)

class CustomRedirectView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse_lazy('core:panel'))
        return HttpResponseRedirect(reverse_lazy('core:login'))

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "core/dashboard.html"


class LoginView(BaseLoginView):
    form_class = LoginUserForm 
    template_name = "core/login.html"
    next_page = reverse_lazy('core:panel')

def simple_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse_lazy('core:login'))


