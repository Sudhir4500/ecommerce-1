
from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import myTokenObtainPairView, RegisterView, profileView
from social_auth.views import GoogleLoginView

urlpatterns = [
    path('login/', myTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/', profileView, name='profile'),
    path('social/google-login/', GoogleLoginView.as_view(), name='google_login'),
]