// app/search/[name]/page.tsx

'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/app/services/apiservice";

export type ProductType = {
    id: string;
    Product_name: string;
    price: number;
    category: string;
    image: string;
};

const SearchResults = () => {
    const { name } = useParams(); // Get the search term from the URL
    const [products, setProducts] = useState<ProductType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await apiService.getwithouttoken(`/api/products/products/?search=${name}`);
                setProducts(response);
            } catch (err: any) {
                console.error("Error fetching search results:", err);
                setError("Failed to fetch products.");
            }
        };

        if (name) {
            fetchSearchResults();
        }
    }, [name]); // Re-fetch when the search term (`name`) changes

    const handleProductClick = (id: string) => {
        // Navigate to the product detail page
        router.push(`/products/${id}`);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Search Results for "{name}"
            </h1>

            {error && <div className="text-red-500">{error}</div>}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="border p-4 rounded shadow-lg cursor-pointer"
                            onClick={() => handleProductClick(product.id)} // Redirect to product detail page
                        >
                            <img
                                src={product.image}
                                alt={product.Product_name}
                                className="w-full h-48 object-cover rounded"
                            />
                            <h2 className="font-semibold mt-2">{product.Product_name}</h2>
                            <p className="text-gray-600">Price: Rs {product.price}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 col-span-full text-center">
                        No products found for "{name}".
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
