from django.conf import settings
from django.contrib import admin
from django.utils.safestring import mark_safe
from mptt.admin import DraggableMPTTAdmin

from .models import Category


@admin.register(Category)
class CategoryAdmin(DraggableMPTTAdmin):
    mptt_level_indent = 20
    list_display = ("tree_actions", "indented_title", "icon", "color_display")

    class Media:
        js = (
            "colorfield/jscolor/jscolor.js"
            if settings.DEBUG
            else "colorfield/jscolor/jscolor.min.js",
        )

    @mark_safe
    def color_display(self, obj):
        if obj.color:
            return f'<input type="text" class="jscolor" value="{obj.color}" disabled readonly />'

    color_display.short_description = "Color"
