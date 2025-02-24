// app/vendorProduct/VendorProduct.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/app/services/apiservice";

export type ProductType = {
  id: string;
  Product_name: string;
  price: number;
  category_name: string;
  image: string;
};

const VendorProduct = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiService.get("/api/products/products/my_products");
      setProducts(response);
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (id: string) => {
    router.push(`/vendorsproducts/${id}`);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">Failed to load products: {error}</div>;

  return (
    <div className="cursor-pointer">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
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
        // if there are no products
        .concat(products.length === 0 ? [
          <div key="no-products" className="text-center col-span-full">No products found</div>
        ] : [])
        }
      </div>
    </div>
  );
};

export default VendorProduct;