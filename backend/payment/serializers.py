# payments/serializers.py
from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'user', 'amount', 'status', 'payment_method', 'stripe_session_id', 'created_at', 'updated_at']
        read_only_fields = ['user', 'status', 'stripe_session_id', 'created_at', 'updated_at']