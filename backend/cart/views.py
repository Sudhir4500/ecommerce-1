from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart
from .serializers import CartSerializer

class CartViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for handling Cart operations.
    """
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure only authenticated users can access
    
    def get_queryset(self):
        # Return only the carts belonging to the current user
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically associate the cart item with the logged-in user
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        user = request.user

        # Check if the product already exists in the user's cart
        cart_item = Cart.objects.filter(user=user, product=product_id).first()

        if cart_item:
            # If it exists, increment the quantity
            cart_item.quantity += 1
            cart_item.save()
            serializer = self.get_serializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # If it doesn't exist, create a new cart item
            return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['delete'], url_path='clear-cart')
    def clear_cart(self, request):
        """
        Custom action to clear the entire cart for the logged-in user.
        """
        Cart.objects.filter(user=request.user).delete()
        return Response({"detail": "Cart cleared successfully."}, status=204)