from rest_framework import viewsets, permissions, filters, generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied
from .models import category, product
from .serializer import CategorySerializer, productSerializer
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from vendormanagement.models import Vendor  # Ensure this import is correct based on your app structure
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class ProductViewSet(viewsets.ModelViewSet):
    queryset = product.objects.all()
    serializer_class = productSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['category__category_name', 'Product_name']
    parser_classes = [MultiPartParser, FormParser,JSONParser]  # Add this to handle file uploads

    def perform_create(self, serializer):
        # Ensure the current user is a vendor
        try:
            vendor = self.request.user.vendor
        except Vendor.DoesNotExist:
            raise PermissionDenied("Only registered vendors can add products.")
        
        # Save the product with the current user as the vendor
        serializer.save(vendor=vendor)

    # Add this method to return products for the logged-in vendor
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_products(self, request):
        """Return products for the logged-in vendor."""
        try:
            vendor = request.user.vendor
            products = product.objects.filter(vendor=vendor)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        except Vendor.DoesNotExist:
            return Response({'detail': 'Vendor not found.'}, status=status.HTTP_404_NOT_FOUND)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

