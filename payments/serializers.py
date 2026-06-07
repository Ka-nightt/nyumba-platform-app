from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Transaction
        fields = ['id','booking','amount','phone_number','mpesa_code',
                  'checkout_id','status','description','created_at']
        read_only_fields = ['id','mpesa_code','checkout_id','status','created_at']
