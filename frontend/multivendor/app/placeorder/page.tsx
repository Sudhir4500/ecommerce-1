'use client';

import { useEffect } from 'react';
import { useLoading } from '../context/Loadingcontext'; // Import the useLoading hook

const OrderSuccessPage = () => {
  const { loading, setLoading } = useLoading();

  // Simulate loading for 2 seconds after the page loads
  useEffect(() => {
    setLoading(true); // Start loading
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [setLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl text-green-800 font-bold mb-4">Order Success!!!!</h1>
      <p className="text-green-500 text-lg">Your order has been placed successfully.</p>
      <p className="text-green-500 text-lg">Thank you for shopping with us.</p>
      <p className="text-green-500 text-lg">You will receive an email confirmation shortly.</p>
    </div>
  );
};

export default OrderSuccessPage;