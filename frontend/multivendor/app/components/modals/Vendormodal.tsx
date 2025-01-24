'use client'
import usevendorModal from "@/app/hooks/usevendor"
import Modal from "./Modal"
import { useState } from "react"
import apiService from "@/app/services/apiservice";
import { useRouter } from "next/navigation";
import Custombutton from "../forms/Custombutton";

const Vendormodal = () => {
    const vendorModal = usevendorModal();
    const router = useRouter();
    const [company_name, setcompany_name] = useState('');
    const [company_address, setCompany_address] = useState('');
    const [error, setError] = useState<string[]>([]);
   


const handlesubmit=async()=>{
    if(company_name &&
        company_address
    ){
        const formdata=new FormData();
        formdata.append('company_name',company_name);
        formdata.append('company_address',company_address);

        const response=await apiService.post('/api/vendors/vendors_profile/',formdata);
        // console.log('api response',response);

        if (response.id){
            // console.log('response success');
            vendorModal.close();
            router.push('/');
        }
        else{
            setError([response.detail]);
        }
    }
}

const vendor=(
    <>
    <form 
    action={handlesubmit}
    className="space-y-4">
        <input onChange={(e) => setcompany_name(e.target.value)} placeholder="Company Name" type="text" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
        <input onChange={(e) => setCompany_address(e.target.value)} placeholder="Company Address" type="text" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
       {
        error.map((error, index) => {
            return (
                <div 
                    key={`error_${index}`}
                    className="p-5 bg-airbnb text-red-800 rounded-xl opacity-80"
                >
                    {error}
                </div>
            )
        })
       }
    </form>
    <Custombutton
    label="Submit for vendor"
    onclick={handlesubmit}/>

    </>
)

  return (
    <Modal
    isOpen={vendorModal.isOpen}
    close={vendorModal.close}
    label="Vendor"
    content={vendor}/>

       
  )
}

export default Vendormodal
