import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Payment
from orders.models import Order, OrderItem
from cart.models import Cart
import logging
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

logger = logging.getLogger(__name__)

# Ensure Stripe API key is set
stripe.api_key = settings.STRIPE_SECRET_KEY

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            logger.info(f"Creating payment intent for user={request.user.id}, username={request.user.username}")
            payment_method = request.data.get('payment_method', 'stripe')
            if payment_method not in ['stripe', 'cod']:
                logger.error(f"Invalid payment method: {payment_method}")
                return Response({"detail": "Invalid payment method"}, status=status.HTTP_400_BAD_REQUEST)

            cart_items = Cart.objects.filter(user=request.user)
            if not cart_items.exists():
                logger.error(f"Cart is empty for user={request.user.id}")
                return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = sum(item.total_price for item in cart_items)
            logger.info(f"Calculated total_amount={total_amount} for user={request.user.id}")

            # Create Payment
            try:
                payment = Payment.objects.create(
                    user=request.user,
                    amount=Decimal(total_amount),
                    status='pending',
                    payment_method=payment_method,
                )
                logger.info(f"Created Payment: id={payment.id}, user={request.user.id}, method={payment_method}, amount={total_amount}")
            except Exception as e:
                logger.error(f"Failed to create Payment: user={request.user.id}, error={str(e)}")
                return Response({"detail": "Failed to create payment record"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Create Order
            try:
                order = Order.objects.create(
                    user=request.user,
                    total_amount=Decimal(total_amount),
                    payment=payment,
                    status='pending',
                )
                logger.info(f"Created Order: id={order.id}, payment_id={payment.id}")
            except Exception as e:
                logger.error(f"Failed to create Order: payment_id={payment.id}, error={str(e)}")
                payment.delete()
                return Response({"detail": "Failed to create order"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Create OrderItems
            try:
                for item in cart_items:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price=item.product.price,
                    )
                logger.info(f"Created OrderItems for order_id={order.id}")
            except Exception as e:
                logger.error(f"Failed to create OrderItems: order_id={order.id}, error={str(e)}")
                order.delete()
                payment.delete()
                return Response({"detail": "Failed to create order items"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response_data = {
                'paymentId': payment.id,
                'orderId': order.id,
            }

            if payment_method == 'stripe':
                try:
                    total_amount_cents = int(total_amount * 100)
                    intent = stripe.PaymentIntent.create(
                        amount=total_amount_cents,
                        currency='usd',
                        payment_method_types=['card'],
                        metadata={
                            'user_id': str(request.user.id),
                            'order_id': str(order.id),
                            'payment_id': str(payment.id)
                        },
                    )
                    response_data.update({
                        'clientSecret': intent['client_secret'],
                        'paymentIntentId': intent.id,
                    })
                    logger.info(f"Created Stripe PaymentIntent: id={intent.id}, payment_id={payment.id}")
                except stripe.error.StripeError as e:
                    logger.error(f"Stripe error: payment_id={payment.id}, error={str(e)}")
                    order.delete()
                    payment.delete()
                    return Response({"detail": f"Stripe error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

            else:
                response_data['message'] = 'COD order created successfully'

            logger.info(f"Returning response: paymentId={payment.id}, orderId={order.id}, user={request.user.id}, response_data={response_data}")
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Payment creation error: user={request.user.id}, error={str(e)}")
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# payments/views.py
class ConfirmPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            payment_id = request.data.get('paymentId')
            cod_status = request.data.get('cod_status', 'pending')

            if not payment_id:
                return Response({"detail": "Payment ID is required"}, status=status.HTTP_400_BAD_REQUEST)

            payment = Payment.objects.get(id=payment_id, user=request.user)

            if payment.payment_method != 'cod':
                return Response({"detail": "Stripe payments are handled via webhook."}, status=status.HTTP_400_BAD_REQUEST)

            if cod_status not in ['confirmed', 'failed', 'pending']:
                return Response({"detail": "Invalid COD status"}, status=status.HTTP_400_BAD_REQUEST)

            payment.status = 'pending' if cod_status == 'pending' else 'pending' if cod_status == 'confirmed' else 'failed'
            order = payment.order
            order.status = 'pending' if cod_status == 'pending' else 'confirmed' if cod_status == 'confirmed' else 'cancelled'

            if cod_status == 'confirmed':
                Cart.objects.filter(user=request.user).delete()

            payment.save()
            order.save()

            return Response({
                "detail": "COD payment updated successfully",
                "payment_status": payment.status,
                "order_status": order.status
            }, status=status.HTTP_200_OK)

        except Payment.DoesNotExist:
            return Response({"detail": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Confirm COD payment error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# payments/views.py
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
        logger.info(f"Received webhook event: type={event['type']}, id={event['id']}")
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {str(e)}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Webhook signature verification failed: {str(e)}")
        return HttpResponse(status=400)

    # Handle events
    try:
        if event['type'] == 'payment_intent.succeeded':
            handle_payment_intent_succeeded(event['data']['object'])
        elif event['type'] == 'payment_intent.payment_failed':
            handle_payment_intent_failed(event['data']['object'])
        elif event['type'] == 'payment_intent.requires_action':
            handle_payment_intent_requires_action(event['data']['object'])
        elif event['type'] == 'payment_intent.canceled':
            handle_payment_intent_canceled(event['data']['object'])
        else:
            logger.info(f"Unhandled event type: {event['type']}")
    except Exception as e:
        logger.error(f"Error processing webhook event {event['type']}: {str(e)}")
        return HttpResponse(status=500)

    return HttpResponse(status=200)

def handle_payment_intent_succeeded(payment_intent):
    try:
        payment_id = payment_intent.metadata.get('payment_id')
        logger.info(f"Handling payment_intent.succeeded: payment_id={payment_id}, payment_intent_id={payment_intent.id}")
        if not payment_id:
            logger.error("Payment ID not found in metadata")
            return

        payment = Payment.objects.get(id=payment_id)
        logger.info(f"Found payment: id={payment.id}, current_status={payment.status}, user={payment.user.id}")
        payment.stripe_session_id = payment_intent.id
        payment.status = 'payment_done'
        payment.save()

        order = payment.order
        logger.info(f"Updating order: id={order.id}, current_status={order.status}")
        order.status = 'completed'
        order.save()

        Cart.objects.filter(user=payment.user).delete()
        logger.info(f"Payment {payment.id} updated to payment_done and cart cleared for user {payment.user.id}")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found for webhook")
    except Exception as e:
        logger.error(f"Error in handle_payment_intent_succeeded: payment_id={payment_id}, error={str(e)}")

def handle_payment_intent_failed(payment_intent):
    try:
        payment_id = payment_intent.metadata.get('payment_id')
        logger.info(f"Handling payment_intent.failed: payment_id={payment_id}")
        if not payment_id:
            logger.error("Payment ID not found in metadata")
            return

        payment = Payment.objects.get(id=payment_id)
        payment.status = 'failed'
        payment.save()

        order = payment.order
        order.status = 'pending'
        order.save()

        logger.info(f"Payment {payment.id} updated to failed via webhook")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found for webhook")
    except Exception as e:
        logger.error(f"Error in handle_payment_intent_failed: {str(e)}")

def handle_payment_intent_requires_action(payment_intent):
    try:
        payment_id = payment_intent.metadata.get('payment_id')
        logger.info(f"Handling payment_intent.requires_action: payment_id={payment_id}")
        if not payment_id:
            logger.error("Payment ID not found in metadata")
            return

        payment = Payment.objects.get(id=payment_id)
        payment.status = 'requires_action'
        payment.save()

        order = payment.order
        order.status = 'pending'
        order.save()

        logger.info(f"Payment {payment.id} updated to requires_action via webhook")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found for webhook")
    except Exception as e:
        logger.error(f"Error in handle_payment_intent_requires_action: {str(e)}")

def handle_payment_intent_canceled(payment_intent):
    try:
        payment_id = payment_intent.metadata.get('payment_id')
        logger.info(f"Handling payment_intent.canceled: payment_id={payment_id}")
        if not payment_id:
            logger.error("Payment ID not found in metadata")
            return

        payment = Payment.objects.get(id=payment_id)
        payment.status = 'incomplete'
        payment.save()

        order = payment.order
        order.status = 'cancelled'
        order.save()

        logger.info(f"Payment {payment.id} updated to incomplete via webhook")

    except Payment.DoesNotExist:
        logger.error(f"Payment {payment_id} not found for webhook")
    except Exception as e:
        logger.error(f"Error in handle_payment_intent_canceled: {str(e)}")


# payments/views.py
class PaymentStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, payment_id):
        try:
            logger.info(f"Fetching payment status: payment_id={payment_id}, user={request.user.id}, username={request.user.username}")
            payment = Payment.objects.get(id=payment_id, user=request.user)
            logger.info(f"Payment found: id={payment.id}, status={payment.status}, order_status={payment.order.status}")
            return Response({
                "payment_id": payment.id,
                "status": payment.status,
                "order_status": payment.order.status
            }, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            # Log all payments for this user to debug
            user_payments = Payment.objects.filter(user=request.user).values('id', 'status')
            logger.error(f"Payment not found: payment_id={payment_id}, user={request.user.id}, available_payments={list(user_payments)}")
            return Response({"detail": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching payment status: payment_id={payment_id}, user={request.user.id}, error={str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)