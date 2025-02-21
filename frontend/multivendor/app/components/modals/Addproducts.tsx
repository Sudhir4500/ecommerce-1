"use client";

import usepropertylistingModal from "@/app/hooks/usepropertylisting";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import apiService from "@/app/services/apiservice";
import Custombutton from "../forms/Custombutton";
import { on } from "events";

export type CategoryType = {
  id: string;
  category_name: string;
};


const Addproducts = ({

}) => {
  const [productname, setproductname] = useState("");
  const [productprice, setproductprice] = useState("");
  const [image, setimage] = useState<File | null>(null);
  const [category, setcategory] = useState<string>("");
  const [stock, setstock] = useState("");
  const [description, setdescription] = useState("");
  const [currentpage, setcurrentpage] = useState(1);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("Product_name", productname);
    formData.append("price", productprice);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("image", image);

    try {
      const response = await apiService.post("/api/products/products/", formData);
      console.log("Product added:", response);
if(response.id){
      alert("Product added successfully");
      productlisting.close();
      //page should refresh after adding product
      window.location.reload();
    }
      else{
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setimage(file); // Set the image file in the state
    }
  };

  const content = (
    <>
      {currentpage === 1 ? (
        <>
          <input
            type="text"
            placeholder="Product name"
            value={productname}
            onChange={(e) => setproductname(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <h2 className="mt-4">Select one category</h2>
          <hr />
          <select
            value={category}
            onChange={(e) => setCategoryHandler(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
          <Custombutton label="Next" onclick={() => setcurrentpage(2)} />
        </>
      ) : (
        <>
          <input
            type="number"
            placeholder="Product price"
            value={productprice}
            onChange={(e) => setproductprice(e.target.value)}
          />
          <input
            type="file"
            onChange={handleimage}
            accept="image/*" // Restrict to image files
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setstock(e.target.value)}
          />
          <div className="flex space-x-4">
            <Custombutton label="Previous" onclick={() => setcurrentpage(1)} />
            <Custombutton label="Submit" onclick={handlesubmit} />
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <Modal
        label="Add Product"
        isOpen={productlisting.isOpen}
        close={productlisting.close}
        content={content}
      />
    </>
  );
};

export default Addproducts;