"use client";
import { useEffect, useState } from "react";
import apiService from "@/app/services/apiservice";
import BecomeVendorButton from "../Navbar/BecomeVendorButton";
import AddpropertyButton from "../Navbar/AddpropertyButton";
import VendorProductButton from "../vendorproduct/vendorproductbtn";

const VendorCheck: React.FC<{ email: string | null; className?: string }> = ({ email, className }) => {
  const [isVendor, setIsVendor] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      setIsVendor(false);
      return;
    }

    const handlePageReload = () => {
      sessionStorage.removeItem(`vendorStatus-${email}`);
    };

    window.addEventListener("beforeunload", handlePageReload);

    const sessionVendorStatus = sessionStorage.getItem(`vendorStatus-${email}`);
    if (sessionVendorStatus !== null) {
      setIsVendor(sessionVendorStatus === "true");
      setLoading(false);
      return;
    }

    const checkVendorStatus = async () => {
      setError(null);
      try {
        const vendorData = await apiService.get("/api/vendors/my_profile/"); // Ensure URL matches backend
        console.log("Vendor profile response:", vendorData);
        if (vendorData && (vendorData.email || vendorData.id)) {  // Check email or id
          setIsVendor(true);
          sessionStorage.setItem(`vendorStatus-${email}`, "true");
        } else {
          setIsVendor(false);
          sessionStorage.setItem(`vendorStatus-${email}`, "false");
        }
      } catch (err: any) {
        console.error("Error checking vendor status:", err);
        if (err.message.includes("404")) {
          setIsVendor(false);
          sessionStorage.setItem(`vendorStatus-${email}`, "false");
        } else {
          setError("Failed to check vendor status. Please try again later.");
          setIsVendor(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkVendorStatus();

    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [email]);

  if (loading) return <div> </div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={className}>
      {isVendor ? (
        <>
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
              className="px-5 py-4 cursor-pointer hover:bg-blue-500 rounded-lg"
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