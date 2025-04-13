from django.urls import path
from .views import CreatePaymentIntentView, ConfirmPaymentView, PaymentStatusView, stripe_webhook

urlpatterns = [
    path('create-payment-intent/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),
    path('confirm-payment/', ConfirmPaymentView.as_view(), name='confirm_payment'),
    path('payment-status/<int:payment_id>/', PaymentStatusView.as_view(), name='payment_status'),
    path('webhook/stripe/', stripe_webhook, name='stripe_webhook'),
]