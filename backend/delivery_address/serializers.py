from rest_framework import serializers
from .models import DeliveryAddress

class deliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        fields = '__all__'
        read_only_fields = ['user']