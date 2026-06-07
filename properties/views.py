from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from .models import Property, PropertyImage, Favorite
from .serializers import (PropertyListSerializer, PropertyDetailSerializer,
                          PropertyCreateUpdateSerializer, PropertyImageSerializer,
                          FavoriteSerializer)
from .filters import PropertyFilter
from users.permissions import IsAgentOrAdmin, IsOwnerOrAdmin


class PropertyViewSet(viewsets.ModelViewSet):
    queryset         = Property.objects.select_related('agent').prefetch_related('images','reviews')
    filterset_class  = PropertyFilter
    search_fields    = ['title','description','address','city','county']
    ordering_fields  = ['price','created_at','views_count','bedrooms']
    ordering         = ['-created_at']

    def get_permissions(self):
        if self.action in ['list','retrieve']:
            return [AllowAny()]
        if self.action == 'create':
            return [IsAgentOrAdmin()]
        if self.action in ['update','partial_update','destroy']:
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PropertyDetailSerializer
        if self.action in ['create','update','partial_update']:
            return PropertyCreateUpdateSerializer
        return PropertyListSerializer

    def get_queryset(self):
        qs   = super().get_queryset()
        user = self.request.user
        if self.action in ['list','retrieve']:
            if user.is_authenticated and user.role == 'admin':
                return qs
            if user.is_authenticated and user.role == 'agent':
                return qs.filter(Q(status='active') | Q(agent=user))
            return qs.filter(status='active')
        if user.is_authenticated and user.role == 'agent':
            return qs.filter(agent=user)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_authenticated or request.user != instance.agent:
            Property.objects.filter(pk=instance.pk).update(views_count=instance.views_count + 1)
            try:
                from analytics.models import AnalyticsEvent
                AnalyticsEvent.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    event_type='property_view',
                    property=instance,
                    ip_address=request.META.get('REMOTE_ADDR'),
                )
            except Exception:
                pass
        return Response(self.get_serializer(instance).data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        qs = Property.objects.filter(status='active', is_featured=True)
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_listings(self, request):
        qs = Property.objects.filter(agent=request.user)
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)

    @action(detail=False, methods=['get'])
    def recommended(self, request):
        if request.user.is_authenticated:
            cities = list(Favorite.objects.filter(user=request.user)
                          .values_list('property__city', flat=True).distinct())
            if cities:
                qs = Property.objects.filter(status='active', city__in=cities).exclude(
                    favorited_by__user=request.user)[:6]
            else:
                qs = Property.objects.filter(status='active').order_by('-views_count')[:6]
        else:
            qs = Property.objects.filter(status='active', is_featured=True)[:6]
        return Response(PropertyListSerializer(qs, many=True, context={'request': request}).data)


class PropertyImageUploadView(generics.CreateAPIView):
    serializer_class   = PropertyImageSerializer
    permission_classes = [IsAgentOrAdmin]

    def perform_create(self, serializer):
        prop = Property.objects.get(pk=self.kwargs['property_id'], agent=self.request.user)
        serializer.save(property=prop)


class PropertyImageDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAgentOrAdmin]
    def get_queryset(self):
        return PropertyImage.objects.filter(property__agent=self.request.user)


class FavoriteListCreateView(generics.ListCreateAPIView):
    serializer_class   = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('property')


class FavoriteDeleteView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
