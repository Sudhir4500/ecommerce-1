'use client'
import usevendorModal from "@/app/hooks/usevendor";
import usepropertylistingModal from "@/app/hooks/usepropertylisting";

interface AddpropertyButtonProps {
    userId?: string|null;
    id?: string|null;
}
const AddpropertyButton:React.FC<AddpropertyButtonProps> = ({
    userId,
    id
}) => {
    const vendorModel=usevendorModal()
    const ProductsListing=usepropertylistingModal()
    // const handleAddproperty = () => {
    //     if(userId||id){
    //         ProductsListing.open()
    //     }
    //     else{
    //         vendorModel.open()
    //     }
    // }
    
  return (
    <div
    onClick={()=>ProductsListing.open()}
    className="p-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600">
      Add Products
    </div>
  )
}

export default AddpropertyButton
