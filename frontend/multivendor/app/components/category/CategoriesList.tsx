'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import apiService from "@/app/services/apiservice";

export type CategoryType = {
    id: string;
    category_name: string;
};
interface CategoriesListProps {
  category?: string;  // category name or selected category
  setcategories?: (category: string) => void;  // setter function to update category
}
const CategoriesList:React.FC<CategoriesListProps> = ({
  category,
  setcategories
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("search") || ""; // Get category from URL
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getwithouttoken('/api/products/categories/');
        setCategories(response);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/categoryproduct?search=${encodeURIComponent(categoryName)}`); // ✅ Now routes correctly
  };

  return (
    <div className="flex space-x-2 cursor-pointer">
      {error ? (
        <div className="text-red-500">Failed to load categories: {error}</div>
      ) : (
        categories.length > 0 ? (
          categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.category_name)}
              className={`border-b-4 p-2 m-2 rounded-xl ${
                selectedCategory === cat.category_name ? 'border-b-red-600' : 'hover:border-b-red-600'
              }`}>
              {cat.category_name}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No categories available.</div>
        )
      )}
    </div>
  );
};

export default CategoriesList;
