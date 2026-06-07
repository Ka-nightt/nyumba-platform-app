from rest_framework import serializers
from .models import Booking
from properties.serializers import PropertyListSerializer
from users.serializers import UserSerializer


class BookingSerializer(serializers.ModelSerializer):
    property_detail = PropertyListSerializer(source='property', read_only=True)
    user_detail     = UserSerializer(source='user', read_only=True)

    class Meta:
        model  = Booking
        fields = ['id','user','user_detail','property','property_detail',
                  'visit_date','visit_time','status','message','agent_notes','created_at']
        read_only_fields = ['id','user','status','agent_notes','created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
