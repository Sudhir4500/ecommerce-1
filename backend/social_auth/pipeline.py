import requests
import cloudinary.uploader
from useraccounts.models import profile  # Capitalized Profile as per Python conventions

def create_profile(backend, user, response, *args, **kwargs):
    # Get or create profile
    profile_instance, created = profile.objects.get_or_create(user=user)
    
    # Handle image upload from Google picture if profile is newly created
    if created and 'picture' in response:
        try:
            image_url = response['picture']
            # Download the image from Google
            image_response = requests.get(image_url, stream=True)
            image_response.raise_for_status()  # Check for HTTP errors
            
            # Upload to Cloudinary directly from the response content
            upload_result = cloudinary.uploader.upload(
                image_response.content,
                resource_type="image",
                folder="profile_pics",  # Optional: organize in a folder
                public_id=f"user_{user.id}_profile"  # Optional: unique identifier
            )
            # Save only the public_id (without path prefix)
            profile_instance.image = upload_result['public_id']
        except requests.exceptions.RequestException as e:
            print(f"Failed to download image: {e}")
        except Exception as e:
            print(f"Failed to upload to Cloudinary: {e}")
    
    # Set full name from response
    profile_instance.full_name = response.get('name', '')
    profile_instance.save()