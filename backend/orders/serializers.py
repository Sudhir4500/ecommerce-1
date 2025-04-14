from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.Product_name', read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'total_price']
        read_only_fields = ['price', 'total_price', 'product_name']

    def get_total_price(self, obj):
        return float(obj.total_price)  # Convert Decimal to float

    
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_status = serializers.CharField(source='payment.status', read_only=True)
    payment_method = serializers.CharField(source='payment.payment_method', read_only=True)
    total_amount = serializers.SerializerMethodField()
    order_number = serializers.SerializerMethodField() 

    class Meta:
        model = Order
        fields = ['id','order_number', 'user', 'total_amount', 'status', 'payment_status', 'payment_method', 'items', 'created_at', 'updated_at']
        read_only_fields = ['user', 'total_amount', 'status', 'payment_status', 'payment_method', 'items', 'created_at', 'updated_at']

    def get_total_amount(self, obj):
        return float(obj.total_amount)  # Convert Decimal to float
    
    def get_order_number(self, obj):
        # Get all orders for the specific user, ordered by creation date
        user_orders = Order.objects.filter(user=obj.user).order_by('created_at')
        # Find the position of the current order in the user's order list
        order_number = list(user_orders).index(obj) + 1
        return order_number