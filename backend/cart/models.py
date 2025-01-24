from django.db import models
from products.models import product
from useraccounts.models import User  # Ensure this is the correct path to your User model
from decimal import Decimal

class Cart(models.Model):
    product = models.ForeignKey(product, on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)  # Ensures only positive values
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'cart'
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'

    def __str__(self):
        return f"{self.product.Product_name} in cart for {self.user.username}"

    @property
    def total_price(self):
        return Decimal(self.quantity * self.product.price)
