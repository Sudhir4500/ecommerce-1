from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('useraccounts.urls')),  # Note the trailing slash
    path('api/products/', include('products.urls')),  # Ensure trailing slash for consistency
    path('api/vendors/', include('vendormanagement.urls')),  # Ensure trailing slash for consistency
    path('api/cart/', include('cart.urls')),  # Ensure trailing slash for consistency
    path('api/', include('delivery_address.urls')),  # Ensure trailing slash for consistency
]
