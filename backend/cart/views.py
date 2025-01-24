from rest_framework import viewsets, permissions
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
   

    @action(detail=False, methods=['delete'], url_path='clear-cart')
    def clear_cart(self, request):
        """
        Custom action to clear the entire cart for the logged-in user.
        """
        Cart.objects.filter(user=request.user).delete()
        return Response({"detail": "Cart cleared successfully."}, status=204)
