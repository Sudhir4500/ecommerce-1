from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import myTokenObtainPairView, RegisterView,CustomTokenObtainPairView


urlpatterns = [
    # path('login/', myTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/', myTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    # path('check/', check_auth, name='check_auth'),
    # path('profile/', profileView, name='profile'),
    
]
