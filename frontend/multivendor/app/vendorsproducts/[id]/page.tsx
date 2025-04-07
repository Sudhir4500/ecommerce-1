// app/vendorsproducts/[id]/page.tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import apiService from "@/app/services/apiservice";
import ConfirmationModal from "@/app/components/forms/ConfirmationModal";// Import the modal
import { useLoading } from "@/app/context/Loadingcontext";

export type ProductType = {
  id: string;
  Product_name: string;
  price: number;
  category_name: string;
  image: string;
  description?: string;
};

const VendorProductDetail = () => {
  const [product, setProduct] = useState<ProductType | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useLoading(); 
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    Product_name: "",
    price: 0,
    description: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // State for modal

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);//start loading
      try {
        const response = await apiService.get(`/api/products/products/${id}`);
        setProduct(response);
        setFormData({
          Product_name: response.Product_name,
          price: response.price,
          description: response.description || "",
        });
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const updatedProduct = await apiService.patch(`/api/products/products/${id}/`, formData);
      setProduct(updatedProduct);
      setEditMode(false);
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/api/products/products/${id}/`);
      router.push("/vendorproduct"); // Redirect to the vendor products list
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message);
    } finally {
      setIsDeleteModalOpen(false); // Close the modal after deletion
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Product Details</h1>

        {editMode ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="Product_name"
                value={formData.Product_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <img
                src={product.image}
                alt={product.Product_name}
                className="w-full max-w-md h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">{product.Product_name}</h2>
                <p className="text-gray-600 mt-2">Price: Rs {product.price}</p>
                <p className="text-gray-600">Category: {product.category_name}</p>
                <p className="text-gray-600 mt-4">{product.description}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)} // Open the modal
                  className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default VendorProductDetail;