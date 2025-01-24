'use client';
import { useEffect, useState } from "react";
import apiService from "@/app/services/apiservice";

export type CategoryType = {
    id: string;
    category_name: string;  // Ensure this matches the backend field
}

interface CategoriesListProps {
  category: string;
  setcategories: (category: string) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({
  category,
  setcategories
}) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getwithouttoken('/api/products/categories/');
      console.log('Response:', response); // Should log: [{id: 1, category_name: 'mens'}, {id: 2, category_name: 'womens'}]
      setCategories(response);  // Set categories correctly
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);  // Update error if any
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex max-w-screen-full -my-2 space-x-2 cursor-pointer">
      {error ? (
        <div className="text-red-500">Failed to load categories: {error}</div>
      ) : (
        categories.length > 0 ? (
          categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setcategories(cat.category_name)} // Set selected category
              className={`border-b-4 p-2 m-6 rounded-xl ${category === cat.category_name ? 'border-b-red-600' : 'hover:border-b-red-600'}`}>
              {cat.category_name}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No categories available.</div>
        )
      )}
    </div>
  );
}

export default CategoriesList;
