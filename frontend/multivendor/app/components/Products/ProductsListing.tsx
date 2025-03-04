"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Next.js Link component
import apiService from "@/app/services/apiservice";
import { useLoading } from "@/app/context/Loadingcontext";
import SkeletonProductCard from "../loading/Skeleton";
import LoadingBar from "../loading/Loading";

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
  const { loading, setLoading } = useLoading();
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getwithouttoken(
        "/api/products/products"
      );
      setProducts(response);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (id: string) => {
    setIsNavigating(true);
    setLoading(true);
    router.push(`/products/${id}`);
  };

  if (error)
    return <div className="text-red-500">Failed to load products: {error}</div>;

  return (
    <div className="cursor-pointer">
      {isNavigating && <LoadingBar />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <SkeletonProductCard key={`skeleton-${index}`} />
            ))
          : products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={(e) => {
                  e.preventDefault(); // Prevent default navigation
                  handleProductClick(product.id); // Use router.push for controlled navigation
                }}
                className="block border border-gray-300 rounded-xl p-4 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.Product_name}
                  className="w-[250px] h-[250px] object-cover"
                />
                <div className="text-center w-full sm:w-3/4 md:w-1/2 lg:w-[250px] max-w-xs truncate mx-auto">
                  {product.Product_name}
                </div>
                <div className="text-center">Price: Rs {product.price}</div>
                <div className="text-center">
                  Category: {product.category_name}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default ProductListing;
