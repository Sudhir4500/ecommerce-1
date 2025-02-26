'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiservice";
import { useLoading } from "@/app/context/Loadingcontext";
import SkeletonProductCard from "../loading/Skeleton";// Import the skeleton component

export type ProductType = {
  id: string;
  Product_name: string;
  price: number;
  category_name: string;
  image: string;
};

const ProductListing = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useLoading(); // Use the global loading state
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await apiService.getwithouttoken("/api/products/products");
      setProducts(response);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  }, [setLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (error) return <div className="text-red-500">Failed to load products: {error}</div>;

  return (
    <div className="cursor-pointer">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          // Show skeleton loading while data is being fetched
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonProductCard key={`skeleton-${index}`} />
          ))
        ) : (
          // Show actual product cards once data is loaded
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-300 rounded-xl p-4 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.image}
                alt={product.Product_name}
                className="w-[250px] h-[250px] object-cover"
              />
              <div className="text-center">{product.Product_name}</div>
              <div className="text-center">Price: Rs {product.price}</div>
              <div className="text-center">Category: {product.category_name}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductListing;