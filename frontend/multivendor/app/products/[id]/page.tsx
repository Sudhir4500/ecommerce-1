'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import apiService from '@/app/services/apiservice';
import { useLoading } from '@/app/context/Loadingcontext'; // Import the useLoading hook
import LoadingBar from '@/app/components/loading/Loading'; // Import the loading bar component

export type ProductType = {
    id: string;
    Product_name: string;
    price: number;
    category_name: string;
    image: string;
    description: string;
    vendor_name: string;
};

const ProductDetail = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState<ProductType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { loading, setLoading } = useLoading(); // To manage loading state

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true); // Start loading
            try {
                const response = await apiService.getwithouttoken(`/api/products/products/${id}/`);
                setProduct(response); // Set the product data
            } catch (err: any) {
                console.error('Error fetching product details:', err);
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, setLoading]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!product) {
        return <div>Loading product details...</div>;
    }

    return (
        <>
            {loading && <LoadingBar />} {/* Show loading bar when loading */}
            <div key={product.id} className="p-4 lg:grid lg:grid-cols-2">
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
                    <p className="text-gray-700 mt-4">Category: {product.category_name}</p>
                    <p className="text-gray-700 mt-4 flex flex-col">
                        <span className="text-violet-500 font-extrabold break-words">Description:</span>
                        {product.description}
                    </p>
                    <p className="text-blue-600 mt-4">Vendor: {product.vendor_name}</p>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;