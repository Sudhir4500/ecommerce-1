'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiService from "@/app/services/apiservice";
import { useLoading } from "@/app/context/Loadingcontext"; // Import the useLoading hook
import SkeletonProductCard from "../components/loading/Skeleton";// Import the skeleton component

export type ProductType = {
  id: string;
  Product_name: string;
  price: number;
  category_name: string | null;
  image: string;
};

const CategoryProductPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('search') || ''; // Get category from URL
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useLoading(); // Use the global loading state
  const router = useRouter(); // Initialize useRouter to navigate to the product detail page

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await apiService.getwithouttoken('/api/products/products/');
        console.log('API Response:', response); // Debugging: Check what API returns

        const filteredProducts = category
          ? response.filter((product: ProductType) => 
              (product.category_name?.toLowerCase() || '') === category.toLowerCase()
            )
          : response;

        setProducts(filteredProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, [category, setLoading]); // Runs when category changes

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`); // Navigate to product detail page
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Products in Category: {category || "All"}
      </h1>

      {error ? (
        <div className="text-red-500">Failed to load products: {error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            // Show skeleton loading while data is being fetched
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonProductCard key={`skeleton-${index}`} />
            ))
          ) : products.length > 0 ? (
            // Show actual products once data is loaded
            products.map((product) => (
              <div 
                key={product.id} 
                className="border p-4 rounded shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product.id)} // Navigate to product detail page on click
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
            // Show "No products found" message if there are no products
            <div className="text-gray-500 col-span-full text-center">
              No products found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryProductPage;