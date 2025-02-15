'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import apiService from '@/app/services/apiservice';
import useCartModal from '@/app/hooks/usecartmodal';

export type ProductType = {
    id: string;
    Product_name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    vendor: string;
    
};

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState<ProductType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1); // For quantity input
    const [loading, setLoading] = useState(false); // For button loading state
    const cartModal = useCartModal(); // To manage cart modal

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiService.getwithouttoken(`/api/products/products/${id}/`);
                setProduct(response); // Set the product data
            } catch (err: any) {
                console.error('Error fetching product details:', err);
                setError('Failed to fetch product details.');
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        setLoading(true);

        try {
            // Make an API call to add the product to the cart
            await apiService.post('/api/cart/cart/', {
                product: product.id,
                quantity,
                price: product.price,
            });

            // Open the cart modal on success
            // cartModal.open();
        } catch (err) {
            console.error('Failed to add product to cart:', err);
            alert('Failed to add product to cart');
            
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!product) {
        return <div>Loading product details...</div>;
    }

    return (
        <>
            <div key={product.id} className="p-4 lg:grid lg:grid-cols-2 ">
                <div>
                    <img
                        src={product.image}
                        alt={product.Product_name}
                        className="w-full max-w-[500px] max-h-[500px] object-cover h-auto mb-4"
                    />
                </div>
                <div className="mt-10 ml-10">
                    <h1 className="text-xl font-bold">{product.Product_name}</h1>
                    <p className="text-gray-700 mt-3">Price: Rs {product.price}</p>
                    <p className="text-gray-700 mt-4">Category: {product.category}</p>
                    <p className="text-gray-700 mt-4 flex flex-col">
                        <span className="text-violet-500 font-extrabold">Description:</span>
                        {product.description}
                    </p>
                    <p className="text-gray-700 mt-4">
                        Quantity:{' '}
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </p>
                    <p className="text-blue-600 mt-4">Vendor: {product.vendor}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className={`bg-blue-500 text-white px-4 py-2 mt-4 rounded ${
                            loading ? 'opacity-50' : ''
                        }`}
                    >
                        {loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
