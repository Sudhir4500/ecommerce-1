'use client'
import usevendorModal from "@/app/hooks/usevendor"
import Modal from "./Modal"
import { useState } from "react"
import apiService from "@/app/services/apiservice";
import { useRouter } from "next/navigation";
import Custombutton from "../forms/Custombutton";

const Vendormodal = () => {
    const vendorModal = usevendorModal();
    const router = useRouter();
    const [company_name, setcompany_name] = useState('');
    const [company_address, setCompany_address] = useState('');
    const [error, setError] = useState<string[]>([]);

    // Handles form submission
    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh on submit

        if (company_name && company_address) {
            // Create the payload to send as JSON
            const payload = {
                company_name,
                company_address
            };

            try {
                const response = await apiService.post('/api/vendors/vendors_profile/', payload);

                if (response.id) {
                    vendorModal.close(); // Close the modal on success
                    router.push('/'); // Redirect to the homepage or desired page
                } else {
                    setError([response.detail || "Something went wrong"]); // Show error if no response ID
                }
            } catch (error) {
                setError([(error as any).response?.data?.detail || "Server error occurred"]); // Catch and show error
            }
        } else {
            setError(["Both fields are required"]); // Show error if fields are empty
        }
    };

    // Form JSX
    const vendor = (
        <>
            <form onSubmit={handlesubmit} className="space-y-4">
                <input 
                    onChange={(e) => setcompany_name(e.target.value)} 
                    value={company_name}
                    placeholder="Company Name" 
                    type="text" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                />
                <input 
                    onChange={(e) => setCompany_address(e.target.value)} 
                    value={company_address}
                    placeholder="Company Address" 
                    type="text" 
                    className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" 
                />
                {error.map((errorMsg, index) => (
                    <div key={index} className="p-5 bg-red-100 text-red-800 rounded-xl opacity-80">
                        {errorMsg}
                    </div>
                ))}
                <Custombutton label="Submit for vendor" onclick={handlesubmit} />
            </form>
        </>
    );

    return (
        <Modal
            isOpen={vendorModal.isOpen}
            close={vendorModal.close}
            label="Vendor"
            content={vendor}
        />
    );
};

export default Vendormodal;
