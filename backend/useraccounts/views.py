
from .models import User
from .serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer,UserWithProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser

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
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Handle multipart/form-data and JSON

    def create(self, request, *args, **kwargs):
        # print("Request data:", request.data) 
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate token
        refresh = RefreshToken.for_user(user)
        token_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        # Return user data including profile
        user_data = UserWithProfileSerializer(user).data

        return Response({
            'user': user_data,
            'token': token_data
        }, status=status.HTTP_201_CREATED)
    

# check if the user is authenticated to get the profile
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def profileView(request):
    if request.method == 'GET':
        # Use request.user instead of request.user.profile
        serializer = UserSerializer(request.user, many=False)  # Fix: Serialize User, not Profile
        # Alternative: Use UserWithProfileSerializer if you want profile data
        serializer = UserWithProfileSerializer(request.user, many=False)
        return Response(serializer.data)
    else:
        # For POST, update user or profile fields based on request data
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# # Check if the user is authenticated
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def check_auth(request):
#     # Check if the user is authenticated
#     if request.user.is_authenticated:
#         return Response({"isLoggedIn": True, "userId": request.user.id}, status=status.HTTP_200_OK)
#     else:
#         return Response({"isLoggedIn": False}, status=status.HTTP_200_OK)



