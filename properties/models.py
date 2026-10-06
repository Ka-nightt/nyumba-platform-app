from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Property(models.Model):
    class Type(models.TextChoices):
        APARTMENT  = 'apartment',  'Apartment'
        HOUSE      = 'house',      'House'
        VILLA      = 'villa',      'Villa'
        COMMERCIAL = 'commercial', 'Commercial'
        LAND       = 'land',       'Land'
        BEDSITTER  = 'bedsitter',  'Bedsitter'


    class ListingType(models.TextChoices):
        RENT = 'rent', 'For Rent'
        SALE = 'sale', 'For Sale'
        BNB = 'bnb', 'BnB / Per Night'

    class Status(models.TextChoices):
        PENDING  = 'pending',  'Pending Verification'
        ACTIVE   = 'active',   'Active'
        RENTED   = 'rented',   'Rented'
        SOLD     = 'sold',     'Sold'
        INACTIVE = 'inactive', 'Inactive'

    agent            = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='listings')
    title            = models.CharField(max_length=200)
    description      = models.TextField()
    property_type    = models.CharField(max_length=20, choices=Type.choices)
    listing_type     = models.CharField(max_length=10, choices=ListingType.choices)
    status           = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    price            = models.DecimalField(max_digits=12, decimal_places=2)
    bedrooms         = models.PositiveIntegerField(default=0)
    bathrooms        = models.PositiveIntegerField(default=0)
    size_sqft        = models.PositiveIntegerField(null=True, blank=True)
    floor            = models.IntegerField(null=True, blank=True)
    address          = models.CharField(max_length=255)
    city             = models.CharField(max_length=100)
    county           = models.CharField(max_length=100)
    latitude         = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude        = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_furnished     = models.BooleanField(default=False)
    has_parking      = models.BooleanField(default=False)
    has_wifi         = models.BooleanField(default=False)
    has_gym          = models.BooleanField(default=False)
    has_pool         = models.BooleanField(default=False)
    has_security     = models.BooleanField(default=False)
    virtual_tour_url = models.URLField(blank=True)
    views_count      = models.PositiveIntegerField(default=0)
    is_featured      = models.BooleanField(default=False)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'properties'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)


class PropertyImage(models.Model):
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image      = models.ImageField(upload_to='properties/')
    caption    = models.CharField(max_length=100, blank=True)
    is_primary = models.BooleanField(default=False)
    order      = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary']

    def save(self, *args, **kwargs):
        if self.is_primary:
            PropertyImage.objects.filter(
                property=self.property, is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class Favorite(models.Model):
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='favorites')
    property   = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user','property']
