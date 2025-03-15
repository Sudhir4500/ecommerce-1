from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests
from useraccounts.serializers import UserSerializer
from django.contrib.auth import get_user_model
import logging
# import settings
from django.conf import settings

logger = logging.getLogger(__name__)
User = get_user_model()

class GoogleLoginView(generics.GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        token = request.data.get('access_token')  # Actually an ID token
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
        try:
            # Verify the ID token
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                client_id  # Ensure it’s a single string, not a list
            )
            logger.info(f"Token verified successfully: {idinfo}")  # Log successful verification
            google_id = idinfo['sub']
            email = idinfo['email']

            # Find or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': email.split('@')[0]}
            )
            refresh = RefreshToken.for_user(user)
            token_data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response({
                'user': UserSerializer(user).data,
                'token': token_data
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"Token verification failed: {str(e)}")  # Log detailed error
            return Response({'error': f'Invalid token: {str(e)}'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error(f"Google OAuth error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        