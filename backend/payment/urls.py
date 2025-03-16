# payments/urls.py
from django.urls import path
from .views import CreatePaymentIntentView, ConfirmPaymentView

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('confirm-payment/', ConfirmPaymentView.as_view(), name='confirm-payment'),
]