// review/page.tsx
'use client';

import { useEffect, useState } from 'react';
import apiService from '@/app/services/apiservice';
import { useRouter } from 'next/navigation';
import AddressFetch from '../components/Address/AddressFetch';
import { useLoading } from '@/app/context/Loadingcontext';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '@/app/lib/stripe';
import StripePaymentForm from '../components/payment/Payment';

interface CartItem {
  id: string;
  quantity: number;
  product_name: string;
  total_price: number;
}


const ReviewOrder = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentId, setPaymentId] = useState<number | null>(null); // Store payment ID
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const cartResponse = await apiService.get('/api/cart/cart/');
        console.log('Cart Response:', cartResponse);
        const cartItems = Array.isArray(cartResponse) ? cartResponse : cartResponse.data || [];
        if (!Array.isArray(cartItems)) {
          throw new Error("Invalid response format: cart items are not an array");
        }
        setCartItems(cartItems);
        setError(null);
      } catch (err: any) {
        console.error('Fetch Error:', err.message);
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = Number(item.total_price) || 0;
    return sum + price;
  }, 0) * 100; // In cents

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (paymentMethod === 'credit_card') {
      // Handle COD payment
      setLoadingPayment(true);
      try {
        console.log('Creating Payment record for COD');
        const response = await apiService.post('/payments/create-payment-intent/', { amount: totalAmount });
        console.log('Payment Intent Response for COD:', response);

        if (response.error) {
          setError(response.error);
          console.log('Payment Intent Error for COD:', response.error);
          setLoadingPayment(false);
          return;
        }

        setPaymentId(response.paymentId); // Store the payment ID

        // Confirm COD payment
        console.log('Confirming COD payment with paymentId:', response.paymentId);
        const confirmResponse = await apiService.post('/payments/confirm-payment/', {
          paymentId: response.paymentId,
          paymentMethod: 'cod', // Send payment method as 'cod'
        });
        console.log('COD Payment Confirmation Response:', confirmResponse);

        setError(null);
        console.log('COD Payment Successful, Redirecting to /placeorder');
        router.push('/placeorder');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('COD Payment Error:', err);
      } finally {
        setLoadingPayment(false);
      }
      return;
    }

    if (paymentMethod === 'paypal') {
      if (!stripe || !elements) {
        setError('Stripe is not loaded.');
        console.log('Stripe or Elements not available');
        return;
      }

      setLoadingPayment(true);
      try {
        console.log('Creating Payment Intent with amount:', totalAmount);
        const response = await apiService.post('/payments/create-payment-intent/', { amount: totalAmount });
        console.log('Payment Intent Response:', response);
        if (response.error) {
          setError(response.error);
          console.log('Payment Intent Error:', response.error);
          setLoadingPayment(false);
          return;
        }

        setPaymentId(response.paymentId); // Store the payment ID

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
          setError('One or more card elements are not loaded.');
          console.log('Card elements not loaded');
          setLoadingPayment(false);
          return;
        }

        console.log('Creating Payment Method');
        const { paymentMethod: createdPaymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
          billing_details: { name: 'Customer Name' },
        });

        if (paymentMethodError) {
          setError(paymentMethodError.message || 'Failed to create payment method');
          console.log('Payment Method Error:', paymentMethodError);
          setLoadingPayment(false);
          return;
        }

        console.log('Confirming Card Payment with clientSecret:', response.clientSecret, 'and paymentMethod:', createdPaymentMethod.id);
        const result = await stripe.confirmCardPayment(response.clientSecret, {
          payment_method: createdPaymentMethod.id,
        });

        console.log('Confirm Card Payment Result:', result);
        if (result.error) {
          setError(result.error.message || 'Payment failed');
          console.log('Payment Confirmation Error:', result.error);
        } else if (result.paymentIntent.status === 'succeeded') {
          // Update payment status in the database
          if (paymentId) {
            console.log('Updating payment status in backend for paymentId:', paymentId);
            await apiService.post('/payments/confirm-payment/', {
              paymentId: paymentId,
              paymentIntentId: result.paymentIntent.id,
              status: 'succeeded', // Send "succeeded" to trigger "payment_done" in backend
              paymentMethod: 'stripe',  // Send payment method as 'stripe'
            });
          }
          setError(null);
          console.log('Payment Successful, Redirecting to /placeorder');
          router.push('/placeorder');
        } else {
          setError('Payment processing failed with status: ' + result.paymentIntent.status);
          console.log('Payment Status:', result.paymentIntent.status);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Payment Error:', err);
      } finally {
        setLoadingPayment(false);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Order</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <h2 className="text-lg font-bold mb-2">Cart Items</h2>
      <ul className="mb-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <li key={item.id} className="mb-2">
              <span className="font-semibold">{item.product_name}</span> - Quantity: {item.quantity} - ${item.total_price}
            </li>
          ))
        ) : (
          <p>No items in your cart.</p>
        )}
      </ul>

      <AddressFetch />

      <h2 className="text-lg font-bold mb-2">Payment Options</h2>
      <div className="mb-4">
        <label className="block mb-2">
          <input
            type="radio"
            name="payment_method"
            value="credit_card"
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          COD (Cash on Delivery)
        </label>
        <label className="block">
          <input
            type="radio"
            name="payment_method"
            value="paypal"
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Stripe(pay with card)
        </label>
      </div>

      {paymentMethod === 'paypal' && <StripePaymentForm cardElementOptions={cardElementOptions} />}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
        disabled={!paymentMethod || loadingPayment}
      >
        {loadingPayment ? 'Processing...' : `Pay $${(totalAmount / 100).toFixed(2)}`}
      </button>
    </div>
  );
};

const WrappedReviewOrder = () => (
  <Elements stripe={stripePromise}>
    <ReviewOrder />
  </Elements>
);

export default WrappedReviewOrder;