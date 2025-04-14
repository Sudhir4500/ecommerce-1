import { OrderItem as OrderItemType } from '@/app/types/orderitem';

interface OrderItemProps {
  item: OrderItemType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  const totalPrice = typeof item.total_price === 'string' 
    ? parseFloat(item.total_price) 
    : item.total_price;

  return (
    <div className="flex justify-between py-2 border-b">
      <div>
        <p className="font-medium">{item.product_name || 'Unknown Product'}</p>
        <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
      </div>
      <p className="text-sm">
        ${isNaN(totalPrice) ? '0.00' : totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default OrderItem;