import requests
import cloudinary.uploader
from useraccounts.models import Profile  # Import from useraccount

def create_profile(backend, user, response, *args, **kwargs):
    profile, created = Profile.objects.get_or_create(user=user)
    if created and 'picture' in response:
        image_url = response['picture']
        upload_result = cloudinary.uploader.upload(image_url)
        profile.image = upload_result['public_id']
    profile.full_name = response.get('name', '')
    profile.save()