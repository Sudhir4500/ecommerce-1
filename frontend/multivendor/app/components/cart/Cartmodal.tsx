"use client";

import { useState, useEffect } from "react";
import Modal from "../modals/Modal"; // Assuming your Modal component is correctly structured
import usecartModal from "@/app/hooks/usecartmodal"; // Hook to handle modal visibility
import useAuthStore from "@/app/hooks/isloggedin"; // Zustand store for auth state
import apiService from "@/app/services/apiservice";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total_price: number; // Ensure this is a number and correctly formatted
  product_name: string;
}

const Cartmodal = () => {
  const cartmodal = usecartModal();
  const loginModal = useLoginModal();
  const { isLoggedIn } = useAuthStore(); // Use Zustand to get the login state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const router = useRouter();

  // Fetch cart data on modal open
  const fetchCartData = async () => {
    try {
      const response = await apiService.get("/api/cart/cart/");
      console.log("Cart Response:", response);

      const cartItems = Array.isArray(response) ? response : response.data || [];
      setCartItems(cartItems);

      const total = cartItems.reduce((sum: any, item: { total_price: any }) => sum + item.total_price, 0);
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

  // Handle delete function with optimistic UI update
  const handleDelete = async (id: string) => {
    try {
      // Optimistic update: immediately remove the item from the UI
      setCartItems((prevCartItems) => {
        const updatedCart = prevCartItems.filter((item) => item.id !== id);
        // Recalculate the total amount after removal
        const total = updatedCart.reduce((sum, item) => sum + item.total_price, 0);
        setTotalAmount(total);
        return updatedCart;
      });

      // Call API to delete the item from the server
      const response = await apiService.delete(`/api/cart/cart/${id}/`);
      console.log('Delete response:', response);

      // If delete fails (e.g., server returns an error), we need to restore the item (optional)
      if (response.status !== 204) {
        console.error("Delete operation failed, restoring cart...");
        fetchCartData();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      // In case of error, re-fetch the data to restore the cart state
      fetchCartData();
    }
  };

  const handleCheckout = () => {
    router.push("/Delivery"); // Redirect to checkout page
  };

  const content = (
    <>
      <div className="flex flex-col space-y-4">
        {cartItems.length > 0 ? (
          <>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <span className="font-semibold">{item.product_name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>Rs {item.price}</span>
                    {/* Delete Button */}
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
                onClick={() => {
                  handleCheckout();
                  cartmodal.close();
                }}
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
    </>
  );

  return (
    <div>
      <Modal
        isOpen={cartmodal.isOpen}
        close={cartmodal.close}
        label="Your Cart"
        content={content}
      />
    </div>
  );
};

export default Cartmodal;
