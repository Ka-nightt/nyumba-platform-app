from django.urls import path
from . import views

urlpatterns = [
    path('track/',     views.track_event,     name='track-event'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
]
