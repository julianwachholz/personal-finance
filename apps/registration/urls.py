from django.urls import path
from knox import views as knox_views

from . import views

urlpatterns = [
    path("user/", views.UserView.as_view()),
    path("user/verify/", views.UserVerifyView.as_view()),
    path("register/", views.UserCreateView.as_view()),
    path("login/", views.LoginView.as_view()),
    path("logout/", knox_views.LogoutView.as_view()),
    path("logoutall/", knox_views.LogoutAllView.as_view()),
    path("forgot-password/", views.ForgotPasswordView.as_view()),
    path("reset-password/", views.ResetPasswordView.as_view()),
]
