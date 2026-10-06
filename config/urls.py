from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render


def landing_page(request):
    try:
        from properties.models import Property
        from users.models import User
        from bookings.models import Booking
        property_count = Property.objects.count()
        user_count     = User.objects.count()
        booking_count  = Booking.objects.count()
    except Exception:
        property_count = user_count = booking_count = 0

    return render(request, 'landing.html', {
        'property_count': property_count,
        'user_count':     user_count,
        'booking_count':  booking_count,
        'frontend_url':   'http://localhost:5173',
    })


urlpatterns = [
    path('',                 landing_page),
    path('admin/',           admin.site.urls),
    path('api/auth/',        include('users.urls')),
    path('api/properties/',  include('properties.urls')),
    path('api/bookings/',    include('bookings.urls')),
    path('api/reviews/',     include('reviews.urls')),
    path('api/analytics/',   include('analytics.urls')),
    path('api/payments/',    include('payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)