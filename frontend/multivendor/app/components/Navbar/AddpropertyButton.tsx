"use client";
import usevendorModal from "@/app/hooks/usevendor";
import usepropertylistingModal from "@/app/hooks/usepropertylisting";

interface AddpropertyButtonProps {
  userId?: string | null; // userId to check if the user is logged in
  id?: string | null; // id to check if the user is a vendor
  className?: string;
}

const AddpropertyButton: React.FC<AddpropertyButtonProps> = ({ userId, id,className}) => {
  const vendorModel = usevendorModal();
  const ProductsListing = usepropertylistingModal();

  const handleAddproperty = () => {
    // Check if the user is logged in and if they are a vendor (based on `id`)
    if (userId && id) {
      ProductsListing.open(); // Open the product listing modal for vendors
    } else if (!userId) {
      vendorModel.open(); // Open the vendor modal if the user is not authenticated
    } else {
      // Handle the case where user is authenticated but not a vendor (optional, depending on your design)
      alert("You need to become a vendor first.");
    }
  };

  return (
    <div
      onClick={handleAddproperty} // Trigger handleAddproperty on click
       className={` ${className}`}
    >
      Add Products
    </div>
  );
};

export default AddpropertyButton;