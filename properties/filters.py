import django_filters
from .models import Property


class PropertyFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price',    lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price',    lookup_expr='lte')
    min_beds  = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='gte')
    max_beds  = django_filters.NumberFilter(field_name='bedrooms', lookup_expr='lte')
    city      = django_filters.CharFilter(lookup_expr='icontains')
    county    = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model  = Property
        fields = [
            'property_type','listing_type','status',
            'bedrooms','bathrooms','city','county',
            'is_furnished','has_parking','has_wifi',
            'has_gym','has_pool','has_security',
        ]
