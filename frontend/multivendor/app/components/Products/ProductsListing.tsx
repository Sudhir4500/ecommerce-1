'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import apiService from "@/app/services/apiservice";

export type ProductType = {
    id: string;
    Product_name: string;
    price: number;
    category: string;
    image: string;
};

const ProductsListing = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize useRouter

    const fetchProducts = async () => {
        try {
            const response = await apiService.getwithouttoken('/api/products/products');
            console.log('Response:', response); // Debugging response
            setProducts(response); // Set products correctly
        } catch (err: any) {
            console.error('Error fetching products:', err);
            setError(err.message); // Update error if any
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductClick = (id: string) => {
        // Navigate to the detail page using the product ID
        router.push(`/products/${id}`);
    };

    return (
        <div className="cursor-pointer">
            {error ? (
                <div className="text-red-500">Failed to load products: {error}</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border border-gray-300 rounded-xl p-4"
                                onClick={() => handleProductClick(product.id)} // Redirect to detail page
                            >
                                <img
                                    src={product.image}
                                    alt={product.Product_name}
                                    className="w-[250px] h-[250px] object-cover"
                                />
                                <div className="text-center">{product.Product_name}</div>
                                <div className="text-center">Price: Rs {product.price}</div>
                                <div className="text-center">Category: {product.category}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsListing;
