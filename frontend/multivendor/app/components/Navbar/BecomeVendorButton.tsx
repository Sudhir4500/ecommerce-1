"use client";
import useLoginModal from "@/app/hooks/useLoginModal";
import usevendorModal from "@/app/hooks/usevendor";

interface addvendorProps {
  userId?: string | null;
  isVendor?: boolean; // Add isVendor prop
}

const BecomeVendorButton: React.FC<addvendorProps> = ({ userId, isVendor }) => {
  const loginmodel = useLoginModal();
  const vendorModel = usevendorModal();

  console.log('BecomeVendorButton - isVendor:', isVendor); // Debugging: Log isVendor

  const handleBecomeVendor = () => {
      if (userId) {
          vendorModel.open();
      } else {
          loginmodel.open();
      }
  };

  // Hide the button if the user is already a vendor
  if (isVendor) {
      return null;
  }

  return (
      <div
          onClick={handleBecomeVendor}
          className="flex items-center justify-center p-2 text-[12px] font-semibold text-white bg-blue-500 rounded-full w-[90px] h-[50px] hover:bg-blue-600 transition-colors duration-200 "
      >
          Become a vendor
      </div>
  );
};

export default BecomeVendorButton;