from rest_framework import generics,permissions
from .models import DeliveryAddress
from .serializers import deliveryAddressSerializer

# Create your views here.
class DeliveryAddressListCreateView(generics.ListCreateAPIView):
    serializer_class = deliveryAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DeliveryAddress.objects.filter(user=self.request.user)

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
    
    def perform_create(self, serializer):
        # Check if a delivery address already exists for the user
        existing_address = DeliveryAddress.objects.filter(user=self.request.user).first()
        if existing_address:
            # Update the existing address
            serializer.instance = existing_address  # Set the instance to update
            serializer.save() 
        else:
            # Create a new address
            serializer.save(user=self.request.user)
