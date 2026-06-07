import base64
import requests
from datetime import datetime
from django.conf import settings


def get_access_token():
    base = 'https://sandbox.safaricom.co.ke' if settings.MPESA_ENV == 'sandbox' else 'https://api.safaricom.co.ke'
    auth = base64.b64encode(
        f'{settings.MPESA_CONSUMER_KEY}:{settings.MPESA_CONSUMER_SECRET}'.encode()
    ).decode()
    resp = requests.get(
        f'{base}/oauth/v1/generate?grant_type=client_credentials',
        headers={'Authorization': f'Basic {auth}'}
    )
    return resp.json().get('access_token')


def stk_push(phone: str, amount: int, account_ref: str, description: str):
    """Initiate Mpesa STK Push payment via Daraja API."""
    base      = 'https://sandbox.safaricom.co.ke' if settings.MPESA_ENV == 'sandbox' else 'https://api.safaricom.co.ke'
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password  = base64.b64encode(
        f'{settings.MPESA_SHORTCODE}{settings.MPESA_PASSKEY}{timestamp}'.encode()
    ).decode()
    token = get_access_token()
    payload = {
        'BusinessShortCode': settings.MPESA_SHORTCODE,
        'Password':          password,
        'Timestamp':         timestamp,
        'TransactionType':   'CustomerPayBillOnline',
        'Amount':            amount,
        'PartyA':            phone,
        'PartyB':            settings.MPESA_SHORTCODE,
        'PhoneNumber':       phone,
        'CallBackURL':       settings.MPESA_CALLBACK_URL,
        'AccountReference':  account_ref,
        'TransactionDesc':   description,
    }
    resp = requests.post(
        f'{base}/mpesa/stkpush/v1/processrequest',
        json=payload,
        headers={'Authorization': f'Bearer {token}'}
    )
    return resp.json()
