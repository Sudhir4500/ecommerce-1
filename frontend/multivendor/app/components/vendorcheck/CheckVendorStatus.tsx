"use client";
import { useEffect, useState } from "react";
import apiService from "@/app/services/apiservice";
import BecomeVendorButton from "../Navbar/BecomeVendorButton";
import AddpropertyButton from "../Navbar/AddpropertyButton";



const VendorCheck: React.FC<{ email: string | null,
  className?: string
 }> = ({ email ,className}) => {
  const [isVendor, setIsVendor] = useState<boolean | null>(null); // State to track if the user is a vendor
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error handling

  // Check if the user is a vendor when email changes
  useEffect(() => {
    if (!email) {
      setLoading(false); // If no email is provided, stop loading
      setIsVendor(false); // Assume user is not a vendor if not logged in
      return;
    }

    const checkVendorStatus = async () => {
      setLoading(true); // Set loading to true while making the API request
      setError(null); // Reset error state

      try {
        // Fetch vendor profile
        const vendorData = await apiService.get(`/api/vendors/my_profile/`,);

        // Check if the vendor profile exists
        if (vendorData && vendorData.email) {
          setIsVendor(true); // User is a vendor
        } else {
          setIsVendor(false); // User is not a vendor
        }
      } catch (err) {
        console.error("Error checking vendor status:", err);
        setError("Failed to check vendor status. Please try again later.");
        setIsVendor(false); // Assume user is not a vendor in case of error
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    checkVendorStatus(); // Run the vendor check when email changes
  }, [email]); // Re-run when email changes

  // Return loading state, error state, or the actual content
  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error if API call fails

  return (
    <div className={`${className}`}>
      {/* Conditional rendering of buttons based on vendor status */}
      {isVendor ? (
        <div className="cursor-pointer">
          <AddpropertyButton userId={email} id={email}
          className="flex items-center justify-center p-2 text-[12px] font-semibold text-white  lg:bg-blue-500   rounded-full w-[90px] h-[50px] hover:bg-blue-600  transition-colors duration-200 max-md:hidden"
          /> {/* Show AddpropertyButton if the user is a vendor */}
        </div>
      ) : (
        <div className="cursor-pointer">
          <BecomeVendorButton userId={email} isVendor={isVendor ?? undefined} 
          className="flex items-center justify-center p-2 text-[12px] font-semibold text-white  lg:bg-blue-500   rounded-full w-[90px] h-[50px] hover:bg-blue-600  transition-colors duration-200 max-md:hidden"/> {/* Show BecomeVendorButton if the user is not a vendor */}
        </div>
      )}

      {/* to show it for md and sm devices */}
      {isVendor ? (
        <div className="cursor-pointer">
          <AddpropertyButton userId={email} id={email}
          className=" px-5 py-4 cursor-pointer hover:bg-gray-100 lg:hidden"
          /> {/* Show AddpropertyButton if the user is a vendor */}
          </div>
      ) : (
        <div className="cursor-pointer">
          <BecomeVendorButton userId={email} isVendor={isVendor ?? undefined} 
           className=" px-5 py-4 cursor-pointer hover:bg-gray-100 lg:hidden"/> {/* Show BecomeVendorButton if the user is not a vendor */}
        </div>
      )}
    </div>
  );
};

export default VendorCheck;