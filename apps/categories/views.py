from django.core import serializers
from django.http import HttpResponse

from .models import Category


def category_list(request):
    categories = Category.objects.all()
    items = serializers.serialize(
        "json", categories, fields=("parent", "name", "icon", "color", "is_expense")
    )
    return HttpResponse(items, content_type="application/json")
