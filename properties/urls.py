from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('', views.PropertyViewSet, basename='property')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:property_id>/images/', views.PropertyImageUploadView.as_view(), name='property-image-upload'),
    path('images/<int:pk>/',          views.PropertyImageDeleteView.as_view(),  name='property-image-delete'),
    path('favorites/',                views.FavoriteListCreateView.as_view(),   name='favorites'),
    path('favorites/<int:pk>/',       views.FavoriteDeleteView.as_view(),       name='favorite-delete'),
]
