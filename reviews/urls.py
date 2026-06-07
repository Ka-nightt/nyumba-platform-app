from django.urls import path
from . import views

urlpatterns = [
    path('<int:property_id>/reviews/', views.ReviewListCreateView.as_view(), name='reviews'),
]
