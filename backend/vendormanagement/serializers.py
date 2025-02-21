from rest_framework import serializers
from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    email=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Vendor
        fields = ['id', 'company_name', 'company_address', 'verified','email', 'created_at', 'updated_at']  # Exclude 'username'
        read_only_fields = ['verified', 'created_at', 'updated_at','email']  # Exclude 'verified', 'created_at', 'updated_at'

    def get_email(self, obj):
        """Fetch the email from the related User model."""
        return obj.username.email if obj.username else None