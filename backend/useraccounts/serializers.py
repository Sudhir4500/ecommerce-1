from rest_framework import serializers
from .models import User, profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

class ProfileSerializer(serializers.ModelSerializer):  # Added for profile-specific data
    image = serializers.ImageField(max_length=None, use_url=True, required=False)
    class Meta:
        model = profile
     
        fields = ['image', 'full_name', 'verified']

    # get image url
    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class UserWithProfileSerializer(serializers.ModelSerializer):  # Optional: combines User and Profile
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile']

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        # token['image'] = user.profile.image
        token['verified'] = user.profile.verified

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    image = serializers.ImageField(max_length=None, use_url=True, required=False, allow_null=True)
    full_name = serializers.CharField(max_length=100, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2', 'image', 'full_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match"})
        return attrs

    def create(self, validated_data):
        # Extract profile-related data
        image = validated_data.pop('image', None)
        full_name = validated_data.pop('full_name', None)

        # Create the User
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()

        # Update the profile created by the signal
        user_profile = user.profile
        if image:
            user_profile.image = image
        if full_name:
            user_profile.full_name = full_name
        user_profile.save()

        return user
    
    
