'use client';

import { useState } from 'react';
import OrderItem from './OrderItem';
import { Order } from '@/app/types/orderitem';

interface OrderCardProps {
  order: Order;
  
}

const capitalize = (str: string) => 
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAmount = typeof order.total_amount === 'string' 
    ? parseFloat(order.total_amount) 
    : order.total_amount;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Order #{order.order_number}</h2>
          <p className="text-sm text-gray-600">
            Placed on: {order.created_at 
              ? new Date(order.created_at).toLocaleDateString() 
              : 'N/A'}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <div className="mt-2">
        <p>
          <strong>Total:</strong> $
          {isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}
        </p>
        <p><strong>Status:</strong> {capitalize(order.status || 'N/A')}</p>
        <p>
          <strong>Payment Status:</strong> 
          {capitalize(order.payment_status || 'N/A')}
        </p>
        <p>
          <strong>Payment Method:</strong> 
          {capitalize(order.payment_method || 'N/A')}
        </p>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <h3 className="font-medium">Items</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))
          ) : (
            <p className="text-gray-600">No items found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;