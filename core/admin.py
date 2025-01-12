from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html

from .models import (
    User,
    Currency,
    ProfitExpectedMargin
)

from .forms import (
    CustomUserChangeForm,
    CustomUserCreationForm,
    ProfitExpectedMarginAdminForm
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    # Campos que se muestran al crear y cambiar usuarios
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}
        ),
    )
    
@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "created"]


@admin.register(ProfitExpectedMargin)
class ProfitExpectedMarginAdmin(admin.ModelAdmin):
    form = ProfitExpectedMarginAdminForm
    list_display = ["porcentage", "created", "updated"]


