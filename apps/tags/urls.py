from django.urls import path

from . import views

urlpatterns = [path("", views.tag_list, name="tag_list")]
