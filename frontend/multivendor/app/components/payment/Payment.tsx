// components/payment/StripePaymentForm.tsx
'use client';

import { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

interface StripePaymentFormProps {
  cardElementOptions: any; // Options for styling Stripe Elements
}

const StripePaymentForm = ({ cardElementOptions }: StripePaymentFormProps) => {
  const [cardBrand, setCardBrand] = useState<string>('unknown'); // Track the card brand

  // Map card brands to Font Awesome icons
  const cardBrandIcons: { [key: string]: any } = {
    visa: faCcVisa,
    mastercard: faCcMastercard,
    amex: faCcAmex,
    discover: faCcDiscover,
    unknown: faCreditCard, // Default icon for unrecognized brands
  };

  // Handle card brand detection
  const handleCardChange = (event: any) => {
    const brand = event.brand || 'unknown'; // Fallback to 'unknown' if no brand detected
    setCardBrand(brand);
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-gray-700">Card Number</label>
        <CardNumberElement
          options={cardElementOptions}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12" // Added pr-12 for icon space
          onChange={handleCardChange} // Detect card brand changes
        />
        {cardBrand && (
          <FontAwesomeIcon
            icon={cardBrandIcons[cardBrand] || cardBrandIcons.unknown}
            className="absolute right-3 top-9 h-6 w-6 text-gray-500"
          />
        )}
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Expiry Date</label>
          <CardExpiryElement
            options={cardElementOptions}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">CVC</label>
          <CardCvcElement
            options={cardElementOptions}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default StripePaymentForm;