from rest_framework import serializers
from .models import Vendor

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['id', 'company_name', 'company_address', 'verified', 'created_at', 'updated_at']  # Exclude 'username'
        read_only_fields = ['verified', 'created_at', 'updated_at']
