from rest_framework import serializers
from .models import Cart
from products.models import product  

class CartSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=product.objects.all())
    product_name = serializers.CharField(source='product.Product_name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'product_name', 'price', 'total_price', 'product', 'quantity', 'user', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at', 'total_price', 'product_name', 'price']

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value