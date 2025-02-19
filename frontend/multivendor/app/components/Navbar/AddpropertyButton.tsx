"use client";
import usevendorModal from "@/app/hooks/usevendor";
import usepropertylistingModal from "@/app/hooks/usepropertylisting";

interface AddpropertyButtonProps {
  userId?: string | null;
  id?: string | null;
}

const AddpropertyButton: React.FC<AddpropertyButtonProps> = ({ userId, id }) => {
  const vendorModel = usevendorModal();
  const ProductsListing = usepropertylistingModal();

  const handleAddproperty = () => {
    
    ProductsListing.open(); // Open the product listing modal
    // if (userId && id) {
    //   ProductsListing.open(); // Open the product listing modal
    // } else {
    //   vendorModel.open(); // Open the vendor modal if user isn't authenticated
    // }
  };

  return (
    <div
      onClick={handleAddproperty} // Ensure this function is triggered on click
      className="p-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
    >
      Add Products
    </div>
  );
};

export default AddpropertyButton;
