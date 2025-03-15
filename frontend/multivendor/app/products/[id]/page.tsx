"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiService from "@/app/services/apiservice";
import useCartModal from "@/app/hooks/usecartmodal";
import ConfirmationModal from "@/app/components/forms/ConfirmationModal";
import { useLoading } from "@/app/context/Loadingcontext";
import LoadingBar from "@/app/components/loading/Loading";

export type ProductType = {
    id: string;
    Product_name: string;
    price: number;
    category_name: string;
    image: string;
    description: string;
    vendor_name: string;
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const { loading, setLoading } = useLoading();
    const cartModal = useCartModal();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleConfirm = () => {
        setIsConfirmationModalOpen(false);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await apiService.getwithouttoken(`/api/products/products/${id}/`);
                setProduct(response);
            } catch (err: any) {
                console.error("Error fetching product details:", err);
                setError("Failed to fetch product details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id, setLoading]);

    const handleAddToCart = async () => {
        if (!product) return;
        setLoading(true);

        try {
            const response = await apiService.post("/api/cart/cart/", {
                product: product.id,
                quantity: quantity, // Send custom quantity
            });
            console.log("Add to cart response:", response);
            // cartModal.open(); // Open cart modal on success
        } catch (err: any) {
            console.error("Failed to add product to cart:", err);
            if (err.status === 401) {
                setModalMessage("Please login to add items to your cart.");
                setIsConfirmationModalOpen(true);
            } else {
                setModalMessage("Failed to add product to cart. Please try again.");
                setIsConfirmationModalOpen(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>Loading product details...</div>;

    return (
        <>
            {loading && <LoadingBar />}
            <div key={product.id} className="p-4 lg:grid lg:grid-cols-2">
                <div>
                    <img
                        src={product.image}
                        alt={product.Product_name}
                        className="w-full max-w-[500px] max-h-[500px] object-cover h-auto mb-4"
                    />
                </div>
                <div className="mt-10 ml-10">
                    <h1 className="text-xl font-bold break-words">{product.Product_name}</h1>
                    <p className="text-gray-700 mt-3">Price: Rs {product.price}</p>
                    <p className="text-gray-700 mt-4">Category: {product.category_name}</p>
                    <p className="text-gray-700 mt-4 flex flex-col">
                        <span className="text-violet-500 font-extrabold break-words">Description:</span>
                        {product.description}
                    </p>
                    <p className="text-gray-700 mt-4">
                        Quantity:{" "}
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1"
                        />
                    </p>
                    <p className="text-blue-600 mt-4">Vendor: {product.vendor_name}</p>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading}
                        className={`bg-blue-500 text-white px-4 py-2 mt-4 rounded ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {loading ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirm}
                title="Error"
                message={modalMessage}
                confirmText="OK"
                showCancelButton={false}
            />
        </>
    );
};

export default ProductDetail;