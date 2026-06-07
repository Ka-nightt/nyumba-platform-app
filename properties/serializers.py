from rest_framework import serializers
from .models import Property, PropertyImage, Favorite
from users.serializers import UserSerializer


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PropertyImage
        fields = ['id','image','caption','is_primary','order']


class PropertyListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    agent_name    = serializers.SerializerMethodField()
    avg_rating    = serializers.ReadOnlyField()
    is_favorited  = serializers.SerializerMethodField()

    class Meta:
        model  = Property
        fields = [
            'id','title','property_type','listing_type','status',
            'price','bedrooms','bathrooms','size_sqft',
            'address','city','county','latitude','longitude',
            'is_furnished','has_parking','views_count','is_featured',
            'primary_image','agent_name','avg_rating','is_favorited','created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None

    def get_agent_name(self, obj):
        return obj.agent.get_full_name()

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    agent  = UserSerializer(read_only=True)

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            'description','floor','has_wifi','has_gym','has_pool',
            'has_security','virtual_tour_url','images','agent','updated_at',
        ]


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Property
        exclude = ['agent','status','views_count','created_at','updated_at']

    def create(self, validated_data):
        validated_data['agent'] = self.context['request'].user
        return super().create(validated_data)


class FavoriteSerializer(serializers.ModelSerializer):
    property_detail = PropertyListSerializer(source='property', read_only=True)

    class Meta:
        model  = Favorite
        fields = ['id','property','property_detail','created_at']
        read_only_fields = ['id','created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
