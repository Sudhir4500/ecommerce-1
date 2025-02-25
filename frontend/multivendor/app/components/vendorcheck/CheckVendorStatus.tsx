"use client";
import { useEffect, useState } from "react";
import apiService from "@/app/services/apiservice";
import BecomeVendorButton from "../Navbar/BecomeVendorButton";
import AddpropertyButton from "../Navbar/AddpropertyButton";
import VendorProductButton from "../vendorproduct/vendorproductbtn";


const VendorCheck: React.FC<{ email: string | null; className?: string }> = ({ email, className }) => {
  const [isVendor, setIsVendor] = useState<boolean | null>(null); // State to track if the user is a vendor
  const [error, setError] = useState<string | null>(null); // Error handling
  const [loading, setLoading] = useState<boolean>(true); // Loading state
 

  // Check if the user is a vendor when email changes or on page reload
  useEffect(() => {
    if (!email) {
      setLoading(false); // Stop loading
      setIsVendor(false); // Assume user is not a vendor if not logged in
      return;
    }

    // Clear sessionStorage on page reload to force an API call
    const handlePageReload = () => {
      sessionStorage.removeItem(`vendorStatus-${email}`);
    };

    // Add event listener for page reload
    window.addEventListener("beforeunload", handlePageReload);

    // Check if vendor status is already stored in sessionStorage (for the current session)
    const sessionVendorStatus = sessionStorage.getItem(`vendorStatus-${email}`);
    if (sessionVendorStatus !== null) {
      setIsVendor(sessionVendorStatus === "true");
      setLoading(false);
      return;
    }

    // If no cached data in sessionStorage, fetch from the API
    const checkVendorStatus = async () => {
      setError(null); // Reset error state

      try {
        // Fetch vendor profile
        const vendorData = await apiService.get("/api/vendors/my_profile/");

        // Check if the vendor profile exists
        if (vendorData && vendorData.email) {
          setIsVendor(true); // User is a vendor
          sessionStorage.setItem(`vendorStatus-${email}`, "true"); // Store in sessionStorage for the current session
        } else {
          setIsVendor(false); // User is not a vendor
          sessionStorage.setItem(`vendorStatus-${email}`, "false"); // Store in sessionStorage for the current session
        }
      } catch (err) {
        console.error("Error checking vendor status:", err);
        setError("Failed to check vendor status. Please try again later.");
        setIsVendor(false); // Assume user is not a vendor in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkVendorStatus(); // Run the vendor check when email changes or on page reload

    // Cleanup event listener
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [email]); // Re-run when email changes

  // Return error state or the actual content
  if (loading) return <div> </div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error if API call fails

  return (
    <div className={className}>
      {isVendor ? (
        <>
        {/* for lg devices */}
          <div className="cursor-pointer flex gap-4">
            <AddpropertyButton
              userId={email}
              id={email}
              className="flex items-center justify-center p-2 text-[12px] font-semibold text-white lg:bg-blue-500 rounded-full w-[90px] h-[50px] hover:bg-blue-600 transition-colors duration-200 max-md:hidden"
            />
            <VendorProductButton
          
            className="flex items-center justify-center p-2 text-[12px] font-semibold text-white lg:bg-blue-500 rounded-full w-[90px] h-[50px] hover:bg-blue-600 transition-colors duration-200 max-md:hidden"
            
            />
          </div>
          <div className="cursor-pointer lg:hidden">
            <AddpropertyButton
              userId={email}
              id={email}
              className="px-5 py-4 cursor-pointer  hover:bg-blue-500 rounded-lg "
            />
            <VendorProductButton
            
            className="px-5 py-4 cursor-pointer hover:bg-blue-500 rounded-lg"

            />
          </div>
        </>
      ) : (
        <>
          <div className="cursor-pointer">
            <BecomeVendorButton
              userId={email}
              isVendor={isVendor ?? undefined}
              className="flex items-center justify-center p-2 text-[12px] font-semibold text-white lg:bg-blue-500 rounded-full w-[90px] h-[50px] hover:bg-blue-600 transition-colors duration-200 max-md:hidden"

            />
          </div>
          <div className="cursor-pointer lg:hidden">
            <BecomeVendorButton
              userId={email}
              isVendor={isVendor ?? undefined}
              className="px-5 py-4 cursor-pointer hover:bg-gray-100"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VendorCheck;