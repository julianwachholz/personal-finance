from django.contrib import admin

from .models import Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "color", "last_used", "use_count")
    list_filter = ("user",)
    search_fields = ("name",)
