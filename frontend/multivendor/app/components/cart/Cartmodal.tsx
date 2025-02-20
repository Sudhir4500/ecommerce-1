"use client";

import { useState, useEffect } from "react";
import Modal from "../modals/Modal";
import usecartModal from "@/app/hooks/usecartmodal";
import useAuthStore from "@/app/hooks/isloggedin";
import apiService from "@/app/services/apiservice";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total_price: number;
  product_name: string;
}

const Cartmodal = () => {
  const cartmodal = usecartModal();
  const loginModal = useLoginModal();
  const { isLoggedIn } = useAuthStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const router = useRouter();

  const fetchCartData = async () => {
    try {
      const response = await apiService.get("/api/cart/cart/");
      const cartItems = Array.isArray(response) ? response : response.data || [];
      setCartItems(cartItems);
      const total = cartItems.reduce((sum: any, item: { total_price: any; }) => sum + item.total_price, 0);
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (cartmodal.isOpen) {
      const checkAuth = async () => {
        if (!isLoggedIn) {
          loginModal.open();
          alert("Please login to view your cart");
          cartmodal.close();
        } else {
          fetchCartData();
        }
      };
      checkAuth();
    }
  }, [cartmodal.isOpen, isLoggedIn, loginModal, cartmodal]);

  const handleDelete = async (id: string) => {
    try {
      setCartItems((prevCartItems) => {
        const updatedCart = prevCartItems.filter((item) => item.id !== id);
        const total = updatedCart.reduce((sum, item) => sum + item.total_price, 0);
        setTotalAmount(total);
        return updatedCart;
      });

      const response = await apiService.delete(`/api/cart/cart/${id}/`);
      if (response.status !== 204) {
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
    setTotalAmount(updatedCartItems.reduce((sum, item) => sum + item.total_price, 0));

    try {
      const updatedItem = updatedCartItems.find((item) => item.id === id);
      if (!updatedItem) return;

      await apiService.patch(`/api/cart/cart/${id}/`, { quantity: updatedItem.quantity });
    } catch (error) {
      console.error("Error increasing quantity:", error);
      fetchCartData(); // Revert to the correct state if the API fails
    }
  };

  const handleDecrease = async (id: string) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1, total_price: (item.quantity - 1) * item.price }
        : item
    );
    setCartItems(updatedCartItems);
    setTotalAmount(updatedCartItems.reduce((sum, item) => sum + item.total_price, 0));

    try {
      const updatedItem = updatedCartItems.find((item) => item.id === id);
      if (!updatedItem || updatedItem.quantity <= 1) return;

      await apiService.patch(`/api/cart/cart/${id}/`, { quantity: updatedItem.quantity });
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      fetchCartData(); // Revert to the correct state if the API fails
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
                  <span>Rs {item.total_price.toFixed(2)}</span>
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
            <button
              onClick={handleCheckout}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Checkout
            </button>
            <button
              onClick={cartmodal.close}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
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
      <Modal isOpen={cartmodal.isOpen} close={cartmodal.close} label="Your Cart" content={content} />
    </div>
  );
};

export default Cartmodal;