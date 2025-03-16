# payments/models.py
from django.db import models
from useraccounts.models import User
from decimal import Decimal

# payments/models.py
class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stripe_session_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)  # Remove default='pending'
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.stripe_session_id} for {self.user.username}"