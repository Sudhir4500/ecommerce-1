from django.db import models

from useraccounts.models import User

# Create your models here.

class DeliveryAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    phone_number = models.CharField(max_length=20)
    city = models.CharField(max_length=255)
    state= models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.address} - {self.city} "
    
    class meta:
        verbose_name="Delivery Address"
        verbose_name_plural="Delivery Addresses"