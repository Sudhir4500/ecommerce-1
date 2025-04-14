'use client';

import { useEffect, useState } from 'react';
import apiService from '../services/apiservice';
import OrderCard from '@/app/components/orderitems/OrderCard';
import { Order } from '@/app/types/orderitem';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiService.get('/orders/orders/dashboard/');
        setOrders(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-gray-600">You have no orders yet.</p>
      )}
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}