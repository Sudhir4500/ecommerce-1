from django.urls import path
from .views import GoogleLoginView

app_name = 'social_auth'  # Add this line to define the app_name

urlpatterns = [
    path('google-login/', GoogleLoginView.as_view(), name='google_login'),
]