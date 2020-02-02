from autocompletefilter.admin import AutocompleteFilterMixin
from autocompletefilter.filters import AutocompleteListFilter
from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Category


@admin.register(Category)
class CategoryAdmin(AutocompleteFilterMixin, DraggableMPTTAdmin):
    mptt_level_indent = 20
    list_display = ("tree_actions", "indented_title", "icon", "color", "user")
    list_filter = (("user", AutocompleteListFilter),)
    search_fields = ("name",)
