from django.urls import path
from .views import DeliveryAddressListCreateView

urlpatterns = [
    path('deliveryaddress/', DeliveryAddressListCreateView.as_view(), name='delivery-address-list-create')
]
