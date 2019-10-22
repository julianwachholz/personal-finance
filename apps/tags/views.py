from django.core import serializers
from django.http import HttpResponse

from .models import Tag


def tag_list(request):
    tags = Tag.objects.all()
    items = serializers.serialize("json", tags, fields=("name",))
    return HttpResponse(items, content_type="application/json")
