from django.contrib import admin
from .models import AnalyticsEvent

@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display  = ['event_type','user','property','ip_address','created_at']
    list_filter   = ['event_type','created_at']
    search_fields = ['user__email','property__title']
    readonly_fields = ['created_at']
