from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer
from .mpesa import stk_push


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    phone       = request.data.get('phone')
    amount      = request.data.get('amount')
    booking_id  = request.data.get('booking_id')
    description = request.data.get('description', 'Nyumba property fee')

    txn = Transaction.objects.create(
        user=request.user,
        amount=amount,
        phone_number=phone,
        booking_id=booking_id,
        description=description,
    )

    result = stk_push(
        phone=phone,
        amount=int(amount),
        account_ref=f'NYUMBA-{txn.pk}',
        description=description,
    )

    if result.get('ResponseCode') == '0':
        txn.checkout_id = result.get('CheckoutRequestID', '')
        txn.save()
        return Response({'transaction_id': txn.pk, 'message': 'STK Push sent. Check your phone.'})

    txn.status = 'failed'
    txn.save()
    return Response({'error': result.get('errorMessage', 'Payment failed.')},
                    status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def mpesa_callback(request):
    """Safaricom posts here after payment completes."""
    body        = request.data.get('Body', {})
    callback    = body.get('stkCallback', {})
    checkout_id = callback.get('CheckoutRequestID')
    result_code = callback.get('ResultCode')

    try:
        txn = Transaction.objects.get(checkout_id=checkout_id)
        if result_code == 0:
            items = {i['Name']: i['Value']
                     for i in callback.get('CallbackMetadata', {}).get('Item', [])}
            txn.mpesa_code = items.get('MpesaReceiptNumber', '')
            txn.status     = 'success'
        else:
            txn.status = 'failed'
        txn.save()
    except Transaction.DoesNotExist:
        pass

    return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})


class TransactionListView(generics.ListAPIView):
    serializer_class   = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Transaction.objects.all()
        return Transaction.objects.filter(user=user)
