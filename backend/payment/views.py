# payment/views.py
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from cart.models import Cart
import logging
from .models import Payment
from decimal import Decimal

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            cart_items = Cart.objects.filter(user=request.user)
            if not cart_items.exists():
                return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = sum(item.total_price for item in cart_items) * 100  # Convert to cents
            total_amount = int(total_amount)

            # Create Payment Intent
            intent = stripe.PaymentIntent.create(
                amount=total_amount,
                currency='usd',
                payment_method_types=['card'],
                metadata={'user_id': str(request.user.id)},
            )

            # Create a Payment record
            payment = Payment.objects.create(
                user=request.user,
                stripe_session_id=intent.id,  # Use Payment Intent ID
                amount=Decimal(total_amount) / 100,  # Convert back to dollars
                status='pending',
            )

            logger.info(f"Created Payment record with ID {payment.id} for user {request.user.username}")
            return Response({
                'clientSecret': intent['client_secret'],
                'paymentId': payment.id,  # Return the payment ID for reference
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Payment Intent error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# payment/views.py
# payment/views.py
class ConfirmPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            payment_id = request.data.get('paymentId')
            payment_intent_id = request.data.get('paymentIntentId')
            payment_status = request.data.get('status')
            payment_method = request.data.get('paymentMethod')

            if not payment_id or not payment_method:
                return Response({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

            payment = Payment.objects.get(id=payment_id, user=request.user)

            if payment_method == 'cod':
                payment.status = 'pending'
            elif payment_method == 'stripe':
                if not payment_intent_id or not payment_status:
                    return Response({"detail": "Missing required fields for Stripe payment"}, status=status.HTTP_400_BAD_REQUEST)
                payment.stripe_session_id = payment_intent_id
                if payment_status == 'succeeded':
                    payment.status = 'payment_done'

            payment.save()
            return Response({"detail": "Payment updated successfully"}, status=status.HTTP_200_OK)

        except Payment.DoesNotExist:
            return Response({"detail": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)