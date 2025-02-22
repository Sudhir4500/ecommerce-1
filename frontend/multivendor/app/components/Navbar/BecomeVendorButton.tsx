"use client";
import useLoginModal from "@/app/hooks/useLoginModal";
import usevendorModal from "@/app/hooks/usevendor";

interface addvendorProps {
  userId?: string | null;
  isVendor?: boolean; // Add isVendor prop
  className?: string;
}

const BecomeVendorButton: React.FC<addvendorProps> = ({ userId, isVendor,className }) => {
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
          className={`${className}`}
      >
          Become a vendor
      </div>
  );
};

export default BecomeVendorButton;