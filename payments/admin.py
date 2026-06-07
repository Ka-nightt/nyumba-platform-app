from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display  = ['user','amount','phone_number','mpesa_code','status','created_at']
    list_filter   = ['status','created_at']
    search_fields = ['user__email','mpesa_code','phone_number']
    readonly_fields = ['checkout_id','mpesa_code','created_at','updated_at']
