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
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await apiService.get("/api/cart/cart/");
        console.log("Cart Response:", response); // Debugging

        // Extract cart items from response (adjust if response structure differs)
        const cartItems = Array.isArray(response) ? response : response.data || [];

        if (!Array.isArray(cartItems)) {
          throw new Error("Invalid response format: cart items are not an array");
        }

        setCartItems(cartItems); // Set the cart items

        // Calculate total amount
        const total = cartItems.reduce((sum: number, item: CartItem) => {
          const price = parseFloat(item.total_price.toString()); // Ensure valid number
          return sum + (isNaN(price) ? 0 : price); // Avoid NaN
        }, 0);

        setTotalAmount(total); // Set total amount
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (cartmodal.isOpen) {
      if (!isLoggedIn) {
        // If not logged in, open the login modal and prevent cart data fetching
        loginModal.open();
        alert("Please login to view your cart");
        cartmodal.close(); // Close the cart modal
      } else {
        fetchCartData();
      }
    }
  }, [cartmodal.isOpen, isLoggedIn, loginModal, cartmodal]);

  // Handle delete function
  const handleDelete = async (id: string) => {
    try {
      // Call API to delete the item from the server
      await apiService.delete(`/api/cart/cart/${id}/`);

      // Update the cart locally by removing the deleted item
      setCartItems((prevCartItems) => {
        const updatedCart = prevCartItems.filter((item) => item.id !== id);
        // Recalculate total amount after removal
        const total = updatedCart.reduce((sum, item) => sum + item.total_price, 0);
        setTotalAmount(total);
        return updatedCart;
      });
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/Delivery"); // Redirect to checkout page
  }

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
