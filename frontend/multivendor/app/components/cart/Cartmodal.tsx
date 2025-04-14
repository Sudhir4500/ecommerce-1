"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "../modals/Modal";
import usecartModal from "@/app/hooks/usecartmodal";
import useAuthStore from "@/app/hooks/isloggedin";
import apiService from "@/app/services/apiservice";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import ConfirmationModal from "../forms/ConfirmationModal";

interface CartItem {
    id: string;
    product: string;
    quantity: number;
    price: number;
    total_price: string | number; // Update type to allow string or number
    product_name: string;
}

const Cartmodal = () => {
    const cartmodal = usecartModal();
    const loginModal = useLoginModal();
    const { isLoggedIn } = useAuthStore();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const router = useRouter();

    const fetchCartData = useCallback(async () => {
        try {
            const response = await apiService.get("/api/cart/cart/");
            const cartItems = Array.isArray(response) ? response : response.data || [];
            setCartItems(cartItems);
            const total = cartItems.reduce((sum: number, item: { total_price: string; }) => sum + parseFloat(item.total_price as string), 0);
            setTotalAmount(total);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }, []);

    useEffect(() => {
        if (cartmodal.isOpen && isLoggedIn) {
            fetchCartData();
        } else if (cartmodal.isOpen && !isLoggedIn) {
            setIsConfirmationModalOpen(true);
        }
    }, [cartmodal.isOpen, isLoggedIn, fetchCartData]);

    const handleConfirmationClose = () => {
        setIsConfirmationModalOpen(false);
        cartmodal.close();
    };

    const handleConfirmationConfirm = () => {
        setIsConfirmationModalOpen(false);
        loginModal.open();
        cartmodal.close();
    };

    const handleDelete = async (id: string) => {
        try {
            setCartItems((prev) => {
                const updatedCart = prev.filter((item) => item.id !== id);
                setTotalAmount(updatedCart.reduce((sum, item) => sum + parseFloat(item.total_price as string), 0));
                return updatedCart;
            });
            const response = await apiService.deletecart(`/api/cart/cart/${id}`);
            if (response && response.status && response.status !== 204) {
                console.warn("Unexpected status code:", response.status);
                fetchCartData();
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            fetchCartData();
        }
    };

    const handleIncrease = async (id: string) => {
        const updatedCartItems = cartItems.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.price }
                : item
        );
        setCartItems(updatedCartItems);
        setTotalAmount(updatedCartItems.reduce((sum, item) => sum + parseFloat(item.total_price as string), 0));

        try {
            const updatedItem = updatedCartItems.find((item) => item.id === id);
            if (!updatedItem) return;
            await apiService.patch(`/api/cart/cart/${id}/`, { quantity: updatedItem.quantity });
        } catch (error) {
            console.error("Error increasing quantity:", error);
            fetchCartData();
        }
    };

    const handleDecrease = async (id: string) => {
        const updatedCartItems = cartItems.map((item) =>
            item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1, total_price: (item.quantity - 1) * item.price }
                : item
        );
        setCartItems(updatedCartItems);
        setTotalAmount(updatedCartItems.reduce((sum, item) => sum + parseFloat(item.total_price as string), 0));

        try {
            const updatedItem = updatedCartItems.find((item) => item.id === id);
            if (!updatedItem || updatedItem.quantity <= 1) return;
            await apiService.patch(`/api/cart/cart/${id}/`, { quantity: updatedItem.quantity });
        } catch (error) {
            console.error("Error decreasing quantity:", error);
            fetchCartData();
        }
    };

    const handleCheckout = () => {
        router.push("/Delivery");
        cartmodal.close();
    };

    const content = (
        <div className="flex flex-col space-y-4">
            {cartItems.length > 0 ? (
                <>
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.id} className="flex justify-between items-center">
                                <div className="flex space-x-4">
                                    <span className="font-semibold">{item.product_name}</span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDecrease(item.id)}
                                            disabled={item.quantity <= 1}
                                            className="px-2 py-1 bg-gray-300 rounded"
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.id)}
                                            className="px-2 py-1 bg-gray-300 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span>Rs {parseFloat(item.total_price as string).toFixed(2)}</span>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold">Total Amount:</span>
                        <span className="text-xl font-bold">
                            Rs {isNaN(totalAmount) || totalAmount === 0 ? "0.00" : totalAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Checkout
                        </button>
                        <button onClick={cartmodal.close} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Close
                        </button>
                    </div>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );

    return (
        <div>
            <Modal
                isOpen={cartmodal.isOpen && !isConfirmationModalOpen}
                close={cartmodal.close}
                label="Your Cart"
                content={content}
            />
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={handleConfirmationClose}
                onConfirm={handleConfirmationConfirm}
                title="Authentication Required"
                message="Please login to view your cart"
                confirmText="OK"
                cancelText="Cancel"
            />
        </div>
    );
};

export default Cartmodal;