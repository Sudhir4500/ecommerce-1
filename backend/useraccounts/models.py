from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

from cloudinary.models import CloudinaryField
import uuid
# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = CloudinaryField('image')
    full_name = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email
    

def create_profile(sender, instance, created, **kwargs):
    if created:
        profile.objects.create(user=instance)

def save_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_profile, sender=User)
post_save.connect(save_profile, sender=User)



