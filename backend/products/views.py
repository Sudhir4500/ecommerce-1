from rest_framework import viewsets, permissions, filters, generics
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import PermissionDenied
from .models import category, product
from .serializer import CategorySerializer, productSerializer
from vendormanagement.models import Vendor  # Ensure this import is correct based on your app structure


class ProductViewSet(viewsets.ModelViewSet):
    queryset = product.objects.all()
    serializer_class = productSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['category__category_name','Product_name']  # Allows filtering by category name
    # search using product name too
    # search_fields = ['product_name']  # Allows filtering by product name

    def perform_create(self, serializer):
        # Ensure the current user is a vendor
        try:
            vendor = self.request.user.vendor
        except Vendor.DoesNotExist:
            raise PermissionDenied("Only registered vendors can add products.")
        
        # Save the product with the current user as the vendor
        serializer.save(vendor=vendor)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

