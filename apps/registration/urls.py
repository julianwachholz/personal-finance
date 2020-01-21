from django.urls import path
from knox import views as knox_views

from . import views

urlpatterns = [
    path("user/", views.UserView.as_view(), name="user"),
    path("user/verify/", views.UserVerifyView.as_view(), name="verify"),
    path("register/", views.UserCreateView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="knox_login"),
    path("logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
]
