from django.db import models


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING   = 'pending',   'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    user        = models.ForeignKey('users.User',           on_delete=models.CASCADE, related_name='bookings')
    property    = models.ForeignKey('properties.Property',  on_delete=models.CASCADE, related_name='bookings')
    visit_date  = models.DateField()
    visit_time  = models.TimeField()
    status      = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    message     = models.TextField(blank=True)
    agent_notes = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} → {self.property} on {self.visit_date}'
