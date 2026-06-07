from django.db import models


class AnalyticsEvent(models.Model):
    EVENT_TYPES = [
        ('property_view',   'Property View'),
        ('search',          'Search'),
        ('favorite_add',    'Favorite Add'),
        ('booking_created', 'Booking Created'),
        ('contact_agent',   'Contact Agent'),
        ('user_signup',     'User Signup'),
        ('session_start',   'Session Start'),
    ]

    user       = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    property   = models.ForeignKey('properties.Property', on_delete=models.SET_NULL, null=True, blank=True)
    metadata   = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes  = [
            models.Index(fields=['event_type','created_at']),
            models.Index(fields=['property','created_at']),
        ]

    def __str__(self):
        return f'{self.event_type} — {self.created_at}'
