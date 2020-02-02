from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from apps.accounts.views import AccountViewSet
from apps.budgets.views import BudgetViewSet
from apps.categories.views import CategoryViewSet
from apps.payees.views import PayeeViewSet
from apps.tags.views import TagViewSet
from apps.transaction_wizard.views import ImportConfigViewSet, ImportFileViewSet
from apps.transactions.views import TransactionViewSet

router = routers.DefaultRouter()
router.register("tags", TagViewSet, basename="tags")
router.register("payees", PayeeViewSet, basename="payees")
router.register("categories", CategoryViewSet, basename="categories")
router.register("accounts", AccountViewSet, basename="accounts")
router.register("budgets", BudgetViewSet, basename="budgets")
router.register("transactions", TransactionViewSet, basename="transactions")
router.register("import/file", ImportFileViewSet, basename="import/file")
router.register("import/config", ImportConfigViewSet, basename="import/config")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.registration.urls")),
    path("api/settings/", include("apps.settings.urls")),
    path("api/", include(router.urls)),
]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = (
        [path("__debug__/", include(debug_toolbar.urls))]
        + urlpatterns
        + [
            path(
                "api-auth/", include("rest_framework.urls", namespace="rest_framework")
            )
        ]
    )
