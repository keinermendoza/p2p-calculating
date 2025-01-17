from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from django.contrib.auth.forms import (
    UserCreationForm,
    UserChangeForm,
    AuthenticationForm,
    UsernameField

)

from django import forms
from .models import (
    User,
    SelectionCalculationPreferences
)

# default admin panel
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password')  

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'  

class LoginUserForm(AuthenticationForm):
    """
    Base class for authenticating users. Extend this to get a form that accepts
    username/password logins.
    """

    username = UsernameField(
        widget=forms.TextInput(attrs={"autofocus": True}),
        label=_("Usuario"),
    )
    password = forms.CharField(
        label=_("Llave"),
        strip=False,
        widget=forms.PasswordInput(attrs={"autocomplete": "current-password"}),
    )

    error_messages = {
        "invalid_login": _(
            "Por favor verifique que su usuario y llave sean los correctos. Ambos son sensibles al uso de Mayusculas."
        ),
        "inactive": _("Cuenta inactiva. Contacte con nuestro soporte."),
    }

# custom admin panel *User* model
class UserNewForm(forms.ModelForm):
    class Meta: 
        model = User 
        fields = ["username", "password"]
        widgets = {
            'username': forms.TextInput(attrs={"autofocus": True}),
        }


    def save(self, *args, **kwargs):
        user = super().save(commit=False)
        password = self.cleaned_data['password']
        user.set_password(password)
        user.save()
        return user


class ProfitExpectedMarginAdminForm(forms.ModelForm):
    class Meta:
        model = SelectionCalculationPreferences
        fields = '__all__'

    def clean(self):
        max_instancias = 1
        if self.instance.pk is None:
            if SelectionCalculationPreferences.objects.count() >= max_instancias:
                raise ValidationError(f"Solo se permiten {max_instancias} instancias de este modelo.")
        return super().clean()