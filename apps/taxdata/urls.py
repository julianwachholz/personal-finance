from django.urls import path

from . import views

urlpatterns = [path("", views.tax_form, name="tax_form")]
