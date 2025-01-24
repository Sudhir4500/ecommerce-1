'use client'
import useLoginModal from "@/app/hooks/useLoginModal"
import usevendorModal from "@/app/hooks/usevendor"


interface addvendorProps {
  userId?: string|null;
}

const BecomeVendorButton:React.FC<addvendorProps> = ({
  userId
}) => {
  const loginmodel=useLoginModal()
  const vendorModel=usevendorModal()

  const handleBecomeVendor = () => {
    if(userId){
      vendorModel.open()}
    else{loginmodel.open()}
  }
  return (
    <div
    onClick={handleBecomeVendor}
    className="p-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600">
      Become a vendor
    </div>
  )
}

export default BecomeVendorButton
