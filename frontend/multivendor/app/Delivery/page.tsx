'use client';

import { useState, useEffect } from "react";
import apiService from "@/app/services/apiservice";
import { useRouter } from "next/navigation";

const DeliveryAddressForm = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        address: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        phone_number: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    // Handle the form data change for input fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the form has empty required fields
        if (Object.values(formData).some(field => field === "")) {
            setError("All fields are required.");
            return;
        }

        try {
            // Sending form data to the backend API
            const response = await apiService.post('/api/deliveryaddress/', formData);
            if (response && response.status === 200) {
                setSuccess("Delivery address saved successfully!");
                setError(null);
                router.push("/review"); // Redirect to the review page
            } else {
                throw new Error("Failed to save delivery address.");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setSuccess(null);
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
            {/* Error and Success messages */}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            {/* The form to submit the delivery address */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="full_name" className="block font-bold">Full Name</label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block font-bold">Address Line 1</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="city" className="block font-bold">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="state" className="block font-bold">State</label>
                    <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="postal_code" className="block font-bold">Postal Code</label>
                    <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="country" className="block font-bold">Country</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone_number" className="block font-bold">Phone Number</label>
                    <input
                        type="text"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Save Address
                </button>
            </form>
        </div>
    );
};

export default DeliveryAddressForm;
