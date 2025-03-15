from django.http import JsonResponse
import os

from django.shortcuts import render
from .models import User
from .serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims here if needed
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom response data here
        data['user'] = {
            'pk': str(self.user.id),  # Ensure UUID is converted to string
            'email': self.user.email
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Create your views here.
class myTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Register a new user   
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    # Generate token
    refresh = RefreshToken.for_user(user)
    token_data = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

    return Response({
        'user': UserSerializer(user).data,
        'token': token_data
    }, status=status.HTTP_201_CREATED)


# check if the user is authenticated to get the profile
@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def profileView(request):
    if request.method == 'GET':
        profile = request.user.profile
        serializer = UserSerializer(profile, many=False)
        return Response(serializer.data)
    else:
        profile = request.user.profile
        serializer = UserSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    


# # Check if the user is authenticated
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def check_auth(request):
#     # Check if the user is authenticated
#     if request.user.is_authenticated:
#         return Response({"isLoggedIn": True, "userId": request.user.id}, status=status.HTTP_200_OK)
#     else:
#         return Response({"isLoggedIn": False}, status=status.HTTP_200_OK)


def debug_env(request):
    return JsonResponse({
        'client_id': os.getenv('GOOGLE_OAUTH2_KEY'),
        'client_secret': os.getenv('GOOGLE_OAUTH2_SECRET'),
    })

