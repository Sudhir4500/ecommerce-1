from rest_framework import serializers
from .models import Cart
from products.models import product

class CartSerializer(serializers.ModelSerializer):
    # Define product as a primary key for POST requests
    product = serializers.PrimaryKeyRelatedField(queryset=product.objects.all())
    product_name = serializers.CharField(source='product.Product_name', read_only=True)
    price = serializers.CharField(source='product.price', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'product_name', 'price', 'total_price', 'product', 'quantity', 'user', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at', 'total_price']  # Ensure 'total_price' is read-only

    def get_total_price(self, obj):
        return obj.total_price  # This will automatically use the total_price property from the model
