# Generated by Django 5.1.4 on 2025-01-17 14:32

import django.core.validators
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "core",
            "0007_rename_profitexpectedmargin_selectioncalculationpreferences_and_more",
        ),
    ]

    operations = [
        migrations.RemoveField(
            model_name="selectioncalculationpreferences",
            name="porcentage",
        ),
        migrations.AddField(
            model_name="selectioncalculationpreferences",
            name="profitMargin",
            field=models.DecimalField(
                decimal_places=2,
                default=1,
                max_digits=3,
                verbose_name="Margen de Ganáncia",
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="selectioncalculationpreferences",
            name="referencePricePosition",
            field=models.IntegerField(
                default=3,
                validators=[
                    django.core.validators.MaxValueValidator(8),
                    django.core.validators.MinValueValidator(1),
                ],
                verbose_name="Posición Precios de Referencia",
            ),
        ),
    ]
