from django.db import models
from useraccounts.models import User
from products.models import product
from decimal import Decimal

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment = models.OneToOneField('payment.Payment', on_delete=models.SET_NULL, null=True, blank=True, related_name='order')
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')

    class Meta:
        db_table = 'order'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of purchase

    class Meta:
        db_table = 'order_item'

    def __str__(self):
        return f"{self.quantity} x {self.product.Product_name} in Order {self.order.id}"

    @property
    def total_price(self):
        return Decimal(self.quantity) * self.price
    


# doc
# """
#     Order Model
#     Represents an order placed by a user in the e-commerce system.
#     Attributes:
#         user (ForeignKey): A reference to the user who placed the order. 
#             Deletes associated orders when the user is deleted.
#         created_at (DateTimeField): The timestamp when the order was created. 
#             Automatically set at creation.
#         updated_at (DateTimeField): The timestamp when the order was last updated. 
#             Automatically updated on save.
#         total_amount (DecimalField): The total monetary value of the order, 
#             with up to 10 digits and 2 decimal places.
#         payment (OneToOneField): A reference to the associated payment for the order. 
#             Can be null or blank. Sets the payment reference to null if the payment is deleted.
#         status (CharField): The current status of the order. 
#             Choices are 'pending', 'completed', or 'cancelled'. Defaults to 'pending'.
#     Meta:
#         db_table: Specifies the database table name as 'order'.
#         verbose_name: A human-readable singular name for the model ('Order').
#         verbose_name_plural: A human-readable plural name for the model ('Orders').
#     Methods:
#         __str__: Returns a string representation of the order in the format 
#             "Order <id> by <username>".
#     """


# """
#     OrderItem represents an individual item within an order.
#     Attributes:
#         order (ForeignKey): A reference to the associated Order. Deleting the order will cascade and delete the related items.
#         product (ForeignKey): A reference to the associated Product. Deleting the product will cascade and delete the related items.
#         quantity (PositiveIntegerField): The quantity of the product in the order.
#         price (DecimalField): The price of the product at the time of purchase, with up to 10 digits and 2 decimal places.
#     Properties:
#         total_price (Decimal): Calculates the total price for this item by multiplying the quantity by the price.
#     Meta:
#         db_table (str): Specifies the database table name as 'order_item'.
#     Methods:
#         __str__(): Returns a string representation of the order item in the format 
#                    "<quantity> x <product name> in Order <order id>".
#     """