"use client";

import { useState } from "react";
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
    phone_number: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log("Submitting form data:", JSON.stringify(formData, null, 2));

    try {
      const response = await apiService.post('/api/deliveryaddress/', formData);
      console.log("API response:", JSON.stringify(response, null, 2));

      setSuccess("Delivery address saved successfully!");
      setError(null);

      console.log("Redirecting to /review");
      router.push("/review");
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "Something went wrong.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default DeliveryAddressForm;