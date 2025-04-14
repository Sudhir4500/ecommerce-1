'use client';

import { useEffect, useState } from 'react';
import apiService from '@/app/services/apiservice';
import { useRouter } from 'next/navigation';
import AddressFetch from '../components/Address/AddressFetch';
import { useLoading } from '@/app/context/Loadingcontext';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '@/app/lib/stripe';
import StripePaymentForm from '../components/payment/Payment';
import { getAccessToken } from '@/app/lib/actions';

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
  const [paymentId, setPaymentId] = useState<number | null>(null);
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
        setError(err.message || 'Failed to fetch cart data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setLoading]);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = Number(item.total_price) || 0;
    return sum + price;
  }, 0) * 100; // In cents

  // Poll payment status with increased attempts and interval
  const pollPaymentStatus = async (paymentId: number, maxAttempts = 15, interval = 3000): Promise<boolean> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`Polling payment status for paymentId: ${paymentId}, attempt: ${attempt}`);
        const response = await apiService.get(`/payments/payment-status/${paymentId}/`);
        console.log('Payment Status Response:', response);
        if (response.status === 'payment_done') {
          console.log('Payment confirmed as payment_done');
          return true;
        } else if (response.status === 'failed') {
          setError('Payment failed on the server.');
          console.log('Payment status: failed');
          return false;
        } else if (response.status === 'requires_action') {
          setError('Payment requires additional action (e.g., 3D Secure).');
          console.log('Payment status: requires_action');
          return false;
        }
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, interval));
      } catch (err: any) {
        console.error('Polling Error Details:', {
          message: err.message,
          attempt,
          paymentId,
          response: err.response,
        });
        if (err.response?.status === 404) {
          setError('Payment ID not found. Please try again or contact support.');
          console.log('Payment status endpoint returned 404');
          return false;
        }
        if (err.message.includes('No authentication token')) {
          setError('Session expired. Please log in again.');
          console.log('Authentication token missing');
          router.push('/login');
          return false;
        }
        if (attempt === maxAttempts) {
          setError('Failed to verify payment status after multiple attempts. Proceeding based on Stripe confirmation.');
          console.log('Polling timed out after max attempts');
          return false; // Allow fallback to proceed
        }
      }
    }
    setError('Payment status check timed out.');
    console.log('Polling exhausted all attempts');
    return false;
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method.');
      console.log('No payment method selected');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setError('You are not logged in. Please log in and try again.');
      console.error('No authentication token found');
      router.push('/login');
      return;
    }

    if (paymentMethod === 'cod') {
      setLoadingPayment(true);
      try {
        console.log('Creating Payment record for COD');
        const response = await apiService.post('/payments/create-payment-intent/', { payment_method: 'cod' });
        console.log('COD Payment Intent Response:', response);

        if (response.error) {
          setError(response.error);
          console.log('COD Payment Intent Error:', response.error);
          setLoadingPayment(false);
          return;
        }

        if (!response.paymentId) {
          setError('No payment ID returned for COD.');
          console.log('COD response missing paymentId:', response);
          setLoadingPayment(false);
          return;
        }

        setPaymentId(response.paymentId);
        console.log('Set paymentId for COD:', response.paymentId);

        console.log('Confirming COD payment with paymentId:', response.paymentId);
        const confirmResponse = await apiService.post('/payments/confirm-payment/', {
          paymentId: response.paymentId,
          cod_status: 'confirmed',
        });
        console.log('COD Payment Confirmation Response:', confirmResponse);

        setError(null);
        console.log('COD Payment Successful, Redirecting to /placeorder');
        router.push('/placeorder');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during COD payment');
        console.error('COD Payment Error:', err);
      } finally {
        setLoadingPayment(false);
      }
      return;
    }

    if (paymentMethod === 'stripe') {
      if (!stripe || !elements) {
        setError('Stripe is not loaded.');
        console.log('Stripe or Elements not available');
        return;
      }

      setLoadingPayment(true);
      try {
        console.log('Creating Payment Intent');
        const response = await apiService.post('/payments/create-payment-intent/', { 
          payment_method: 'stripe' 
        });
        console.log('Stripe Payment Intent Response:', response);
        
        if (response.error) {
          setError(response.error);
          console.log('Stripe Payment Intent Error:', response.error);
          setLoadingPayment(false);
          return;
        }

        if (!response.paymentId) {
          setError('No payment ID returned from server.');
          console.log('Stripe response missing paymentId:', response);
          setLoadingPayment(false);
          return;
        }

        const currentPaymentId = response.paymentId; // Store in local variable
        setPaymentId(currentPaymentId); // Also set in state
        console.log('Payment ID for Stripe:', currentPaymentId);
        
        const clientSecret = response.clientSecret;
        if (!clientSecret) {
          setError('No client secret returned from server.');
          console.log('Missing client secret in response');
          setLoadingPayment(false);
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
          setError('Card number element not loaded.');
          console.log('Card number element not loaded');
          setLoadingPayment(false);
          return;
        }

        console.log('Creating Payment Method');
        const { paymentMethod: stripePaymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
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

        console.log('Confirming Card Payment with clientSecret:', clientSecret);
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: stripePaymentMethod.id,
        });

        console.log('Confirm Card Payment Result:', result);

        if (result.error) {
          setError(result.error.message || 'Payment failed');
          console.log('Payment Confirmation Error:', result.error);
          setLoadingPayment(false);
          return;
        }

        if (result.paymentIntent.status === 'succeeded') {
          console.log('Stripe payment succeeded, verifying with backend for paymentId:', currentPaymentId);
          
          // First try to verify with backend
          const isConfirmed = await pollPaymentStatus(currentPaymentId);
          
          if (isConfirmed) {
            console.log('Backend confirmed payment success');
            setError(null);
            router.push('/placeorder');
          } else {
            // If backend verification fails but Stripe succeeded, proceed anyway
            console.warn('Backend verification failed but Stripe succeeded, proceeding with order');
            setError(null);
            router.push('/placeorder');
          }
        } else if (result.paymentIntent.status === 'requires_action') {
          setError('Payment requires additional action (e.g., 3D Secure). Please follow the instructions.');
          console.log('Payment status: requires_action');
        } else {
          setError(`Payment processing failed with status: ${result.paymentIntent.status}`);
          console.log('Unexpected Payment Status:', result.paymentIntent.status);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during Stripe payment');
        console.error('Stripe Payment Error:', err);
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
            value="cod"
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          COD (Cash on Delivery)
        </label>
        <label className="block">
          <input
            type="radio"
            name="payment_method"
            value="stripe"
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          Stripe (Pay with Card)
        </label>
      </div>

      {paymentMethod === 'stripe' && <StripePaymentForm cardElementOptions={cardElementOptions} />}

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