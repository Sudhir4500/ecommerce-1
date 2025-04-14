from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart
from payment.models import Payment
import logging

logger = logging.getLogger(__name__)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
# create order from cart items and clear the cart on success
    def create(self, request, *args, **kwargs):
        user = request.user
        cart_items = Cart.objects.filter(user=user)
        if not cart_items.exists():
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Calculate total amount
            total_amount = sum(item.total_price for item in cart_items)

            # Create Payment record
            payment_method = request.data.get('payment_method')
            if payment_method not in ['stripe', 'cod']:
                return Response({"detail": "Invalid payment method"}, status=status.HTTP_400_BAD_REQUEST)

            payment = Payment.objects.create(
                user=user,
                amount=total_amount,
                status='pending' if payment_method == 'cod' else 'pending',
                payment_method=payment_method,
            )

            # Create Order
            order = Order.objects.create(
                user=user,
                total_amount=total_amount,
                payment=payment,
                status='pending',
            )

            # Create OrderItems
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price,
                )

            # Clear the cart
            cart_items.delete()

            serializer = self.get_serializer(order)
            logger.info(f"Created order {order.id} for user {user.username}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Order creation error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Retrieve all orders for the dashboard.

    # This view retrieves all orders associated with the currently authenticated user,
    # ordered by their creation date in descending order. The data is serialized and
    # returned as a JSON response.

    # Returns:
    #     Response: A Response object containing serialized order data and an HTTP 200 status code.
    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request):
        """Retrieve all orders for the dashboard."""
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)