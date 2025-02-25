"use client";

import usepropertylistingModal from "@/app/hooks/usepropertylisting";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import apiService from "@/app/services/apiservice";
import Custombutton from "../forms/Custombutton";
import ConfirmationModal from "../forms/ConfirmationModal";

export type CategoryType = {
  id: string;
  category_name: string;
};

const Addproducts = () => {
  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState("");
  const [image, setimage] = useState<File | null>(null);
  const [category, setcategory] = useState<string>("");
  const [stock, setstock] = useState("");
  const [description, setdescription] = useState("");
  const [currentpage, setcurrentpage] = useState(1);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const productlisting = usepropertylistingModal();
  const router = useRouter();

  const setCategoryHandler = (category: string) => {
    setcategory(category);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getwithouttoken("/api/products/categories/");
        setCategories(response);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const handlesubmit = async () => {
    if (
      !productname.trim() ||
      !productprice.trim() ||
      !category.trim() ||
      !stock.trim() ||
      !description.trim() ||
      !image
    ) {
      setModalMessage("Please fill in all fields");
      
      setIsConfirmationModalOpen(true);
      
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("Product_name", productname);
    formData.append("price", productprice);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("image", image);

    try {
      const response = await apiService.post("/api/products/products/", formData);


      if (response.id) {
       
        setModalMessage("Product added successfully");
        setIsConfirmationModalOpen(true); // Show success modal
      } else {
        setModalMessage("Failed to add product");
        setIsConfirmationModalOpen(true); // Show error modal
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setModalMessage("Failed to add product");
      setIsConfirmationModalOpen(true); // Show error modal
    }
    finally {
    setIsLoading(false);
    }
  };

  const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setimage(file);
    }
  };

  const handleConfirm = () => {
    
    setIsConfirmationModalOpen(false); // Close the modal
    if (modalMessage.includes("successfully")) {
      productlisting.close(); // Close the product listing modal
      window.location.reload(); // Refresh the page
      router.push("/vendorproduct"); // Redirect to the vendor product page
    }
  };

  const content = (
    <div className="space-y-6">
      {currentpage === 1 ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Enter product name"
              value={productname}
              onChange={(e) => setproductname(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategoryHandler(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
          <Custombutton
            label="Next"
            onclick={() => setcurrentpage(2)}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          />
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Price</label>
            <input
              type="number"
              placeholder="Enter product price"
              value={productprice}
              onChange={(e) => setproductprice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              onChange={handleimage}
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stock}
              onChange={(e) => setstock(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <Custombutton
              label="Previous"
              onclick={() => setcurrentpage(1)}
              className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            />
            <Custombutton
               label={isLoading ? "Submitting..." : "Submit"}
              onclick={handlesubmit}
              disabled={isLoading} 
              // className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              className={isLoading ? "opacity-50 cursor-not-allowed flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200" : "flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <Modal
        label="Add Product"
        isOpen={productlisting.isOpen}
        close={productlisting.close}
        content={content}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirm} // Run actions when OK is clicked
        title={modalMessage.includes("successfully") ? "Success" : "Error"}
        message={modalMessage}
        confirmText="OK"
        showCancelButton={false} // Hide Cancel button for success
      />
    </>
  );
};

export default Addproducts;