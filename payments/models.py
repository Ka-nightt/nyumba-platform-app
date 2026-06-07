from django.db import models


class Transaction(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUCCESS = 'success', 'Success'
        FAILED  = 'failed',  'Failed'

    booking      = models.ForeignKey('bookings.Booking', on_delete=models.CASCADE,
                                     related_name='transactions', null=True, blank=True)
    user         = models.ForeignKey('users.User', on_delete=models.CASCADE)
    amount       = models.DecimalField(max_digits=10, decimal_places=2)
    phone_number = models.CharField(max_length=20)
    mpesa_code   = models.CharField(max_length=50,  blank=True)
    checkout_id  = models.CharField(max_length=100, blank=True)
    status       = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    description  = models.CharField(max_length=200, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} — KES {self.amount} [{self.status}]'
