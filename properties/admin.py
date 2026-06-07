from django.contrib import admin
from .models import Property, PropertyImage, Favorite

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display  = ['title','agent','property_type','listing_type','status','price','city','views_count','is_featured']
    list_filter   = ['status','property_type','listing_type','city','is_featured']
    search_fields = ['title','address','city','agent__email']
    list_editable = ['status','is_featured']
    inlines       = [PropertyImageInline]

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user','property','created_at']
