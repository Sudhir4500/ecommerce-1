from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from .models import Vendor
from .serializers import VendorSerializer
from .permission import IsOwnerOrReadOnly  # Assuming a custom permission for ownership

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'company_address']  # Adjust fields as per the Vendor model
    ordering_fields = ['created_at', 'company_name']
    ordering = ['-created_at']

    def perform_create(self, serializer):
        """Associate the current user with the newly created Vendor."""
        try:
            serializer.save(username=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        """Override create to provide custom error handling."""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        """Return appropriate permissions based on the action."""
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        return super().get_permissions()
