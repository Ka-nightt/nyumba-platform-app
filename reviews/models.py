from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    user       = models.ForeignKey('users.User',          on_delete=models.CASCADE, related_name='reviews')
    property   = models.ForeignKey('properties.Property', on_delete=models.CASCADE, related_name='reviews')
    rating     = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user','property']
        ordering        = ['-created_at']

    def __str__(self):
        return f'{self.user} — {self.property} ({self.rating}/5)'
