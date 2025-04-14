# payments/models.py
from django.db import models
from useraccounts.models import User

class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    stripe_session_id = models.CharField(max_length=255, blank=True, null=True)  # Optional for COD
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=50,
        choices=[
            ('pending', 'Pending'),           # Initial state
            ('payment_done', 'Payment Done'), # Succeeded
            ('failed', 'Failed'),             # Failed
            ('incomplete', 'Incomplete'),     # Requires payment method, canceled, or not confirmed
            ('processing', 'Processing'),     # Payment is being processed
            ('requires_action', 'Requires Action'),  # 3D Secure or other action needed
        ],
        default='pending'
    )
    payment_method = models.CharField(
        max_length=50,
        choices=[
            ('stripe', 'Stripe'),
            ('cod', 'Cash on Delivery'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Payment {self.id} for {self.user.username} ({self.payment_method})"