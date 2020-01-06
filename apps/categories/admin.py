from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Category


@admin.register(Category)
class CategoryAdmin(DraggableMPTTAdmin):
    mptt_level_indent = 20
    list_display = ("tree_actions", "indented_title", "icon", "color")
    list_filter = ("user",)
    search_fields = ("name",)
