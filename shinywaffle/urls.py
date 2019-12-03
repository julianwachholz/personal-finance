"""shinywaffle URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from apps.accounts.views import AccountViewSet
from apps.categories.views import CategoryTreeViewSet, CategoryViewSet
from apps.tags.views import TagViewSet

router = routers.DefaultRouter()
router.register(r"tags", TagViewSet, basename="tags")
router.register(r"categories/tree", CategoryTreeViewSet, basename="categories/tree")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"accounts", AccountViewSet, basename="accounts")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("datawizard/", include("data_wizard.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
