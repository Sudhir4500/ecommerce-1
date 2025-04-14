
from .models import User
from .serializers import UserSerializer, RegisterSerializer, MyTokenObtainPairSerializer,UserWithProfileSerializer,ProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from rest_framework.decorators import api_view, permission_classes,parser_classes
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
    

# Profile view with GET and PATCH support
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def profileView(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserWithProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':
        try:
            profile_instance = user.profile
            profile_data = {}

            # Extract and map data from request
            if 'name' in request.data:
                profile_data['full_name'] = request.data['name']
            if 'image' in request.data:
                profile_data['image'] = request.data['image']

            # Update profile using ProfileSerializer
            serializer = ProfileSerializer(
                instance=profile_instance,
                data=profile_data,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                # Return updated user data
                updated_user_serializer = UserWithProfileSerializer(user)
                return Response(updated_user_serializer.data, status=status.HTTP_200_OK)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except AttributeError:
            return Response(
                {"error": "User profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# Delete profile view (optional, if you want to support DELETE from frontend)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteProfileView(request):
    print("Received DELETE request from:", request.user.email)
    user = request.user
    user.delete()
    print("User deleted:", request.user.email)
    return Response({"message": "Profile deleted successfully"}, status=status.HTTP_204_NO_CONTENT)





    


# # Check if the user is authenticated
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def check_auth(request):
#     # Check if the user is authenticated
#     if request.user.is_authenticated:
#         return Response({"isLoggedIn": True, "userId": request.user.id}, status=status.HTTP_200_OK)
#     else:
#         return Response({"isLoggedIn": False}, status=status.HTTP_200_OK)


