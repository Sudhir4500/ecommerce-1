"use client";

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiservice";
import BecomeVendorButton from "../Navbar/BecomeVendorButton";
import AddpropertyButton from "../Navbar/AddpropertyButton";

const VendorCheck: React.FC<{ email: string | null; className?: string }> = ({ email, className }) => {
  const [isVendor, setIsVendor] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setIsVendor(false);
      return;
    }

    // Check if vendor status is cached
    const cachedStatus = localStorage.getItem(`vendorStatus_${email}`);

    if (cachedStatus !== null) {
      setIsVendor(cachedStatus === "true");
      return;
    }

    const checkVendorStatus = async () => {
      try {
        const vendorData = await apiService.get("/api/vendors/my_profile/");

        const isVendor = vendorData && vendorData.email ? true : false;
        setIsVendor(isVendor);

        // Cache the vendor status
        localStorage.setItem(`vendorStatus_${email}`, JSON.stringify(isVendor));
      } catch (err) {
        console.error("Error checking vendor status:", err);
        setError("Failed to check vendor status. Please try again later.");
        setIsVendor(false);
      }
    };

    checkVendorStatus();
  }, [email]);

  if (error) return <div>{error}</div>;

  return (
    <div className={className}>
      {isVendor ? (
        <>
          <div className="cursor-pointer">
            <AddpropertyButton
              userId={email}
              id={email}
              className="flex items-center justify-center p-2 text-[12px] font-semibold text-white lg:bg-blue-500 rounded-full w-[90px] h-[50px] hover:bg-blue-600 transition-colors duration-200 max-md:hidden"
            />
          </div>
          <div className="cursor-pointer lg:hidden">
            <AddpropertyButton
              userId={email}
              id={email}
              className="px-5 py-4 cursor-pointer hover:bg-gray-100"
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
