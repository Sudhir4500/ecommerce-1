'use client';

import { useEffect, useState } from 'react';
import apiService from '@/app/services/apiservice';
import { useRouter } from 'next/navigation';

interface CartItem {
    id: string;
    quantity: number;
    product_name: string;
}

interface DeliveryAddress {
    full_name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number: string;
}
// export type deliveryAddress = {
//     full_name: string;
//     address: string;
//     city: string;
//     state: string;
//     postal_code: string;
//     country: string;
//     phone_number: string;
// }

const ReviewOrder = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // Ensure cartItems is initialized as an empty array
    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const Router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const cartResponse = await apiService.get('/api/cart/cart/');
                const addressResponse = await apiService.get('/api/deliveryaddress/');
                console.log('Cart Response:', cartResponse.data);
            console.log('Address Response:', addressResponse.data);

            // Ensure cartResponse.data is an array and pass it to setCartItems
            const cartItems = Array.isArray(cartResponse) ? cartResponse : cartResponse.data || [];

            if (!Array.isArray(cartItems)) {
              throw new Error("Invalid response format: cart items are not an array");
            }
    
            setCartItems(cartItems);  // Ensure cartResponse.data is an array
                setDeliveryAddress(addressResponse.data || null);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePaymentSubmit = async () => {
        if (!paymentMethod) {
            setError('Please select a payment method.');
            return;
        }
        try {
            // const response = await apiService.post('/api/orders/', {
            //     payment_method: paymentMethod,
            // });
            Router.push('/placeorder')
            
        } catch (err: any) {
            setError(err.message || 'Failed to place the order.');
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    // handlePaymentSubmit function is defined here
    

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Review Order</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <h2 className="text-lg font-bold mb-2">Cart Items</h2>
            <ul className="mb-4">
                {cartItems && cartItems.length > 0 ? ( // Safely check cartItems before accessing length
                    cartItems.map((item: CartItem) => (
                        <li key={item.id} className="mb-2">
                        {item.product_name|| item.product_name} - Quantity: {item.quantity}
                    </li>
                    ))
                ) : (
                    <p>No items in your cart.</p>
                )}
            </ul>

            <h2 className="text-lg font-bold mb-2">Delivery Address</h2>
            {deliveryAddress && deliveryAddress.length > 0 ? (
                deliveryAddress.map((address, index) => (
                    <div key={index} className="mb-4">
                        <p>{address.full_name}</p>
                        <p>{address.address}</p>
                        <p>
                            {address.city}, {address.state},{' '}
                            {address.postal_code}
                        </p>
                        <p>{address.country}</p>
                        <p>{address.phone_number}</p>
                    </div>
                ))
            ) : (
                <p className="mb-4">No delivery address found.</p>
            )}

            <h2 className="text-lg font-bold mb-2">Payment Options</h2>
            <div className="mb-4">
                <label className="block">
                    <input
                        type="radio"
                        name="payment_method"
                        value="credit_card"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    COD(Cash on Delivery)
                </label>
                <label className="block">
                    <input
                        type="radio"
                        name="payment_method"
                        value="paypal"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                </label>
            </div>

            <button
                onClick={handlePaymentSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
                Place Order
            </button>
        </div>
    );
};

export default ReviewOrder;
