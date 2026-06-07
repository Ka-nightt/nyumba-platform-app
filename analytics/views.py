from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import AnalyticsEvent
from users.permissions import IsAdminUser


@api_view(['POST'])
@permission_classes([AllowAny])
def track_event(request):
    try:
        AnalyticsEvent.objects.create(
            user=request.user if request.user.is_authenticated else None,
            event_type=request.data.get('event_type'),
            property_id=request.data.get('property_id'),
            metadata=request.data.get('metadata', {}),
            ip_address=request.META.get('REMOTE_ADDR'),
        )
    except Exception:
        pass
    return Response({'status': 'ok'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    days  = int(request.query_params.get('days', 30))
    since = timezone.now() - timedelta(days=days)

    activity = (
        AnalyticsEvent.objects
        .filter(created_at__gte=since)
        .extra(select={'day': "DATE(created_at)"})
        .values('day','event_type')
        .annotate(count=Count('id'))
        .order_by('day')
    )

    top_properties = (
        AnalyticsEvent.objects
        .filter(event_type='property_view', created_at__gte=since)
        .values('property__id','property__title','property__city')
        .annotate(views=Count('id'))
        .order_by('-views')[:10]
    )

    event_totals = (
        AnalyticsEvent.objects
        .filter(created_at__gte=since)
        .values('event_type')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return Response({
        'activity':       list(activity),
        'top_properties': list(top_properties),
        'event_totals':   list(event_totals),
    })
