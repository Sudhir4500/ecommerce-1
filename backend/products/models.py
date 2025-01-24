from django.db import models
from cloudinary.models import CloudinaryField
import uuid


class category(models.Model):
  category_name = models.CharField(max_length=50)

  def __str__(self):
    return self.category_name

# Create your models here.
class product(models.Model):
    id= models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vendor = models.ForeignKey('vendormanagement.Vendor', on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(category, on_delete=models.CASCADE, related_name='products')
    Product_name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = CloudinaryField('image')
    stock = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.Product_name
