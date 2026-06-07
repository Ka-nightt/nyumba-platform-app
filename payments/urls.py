from django.urls import path
from . import views

urlpatterns = [
    path('',                 views.TransactionListView.as_view(), name='transactions'),
    path('initiate/',        views.initiate_payment,              name='initiate-payment'),
    path('mpesa/callback/',  views.mpesa_callback,                name='mpesa-callback'),
]
