'use client';

import useLoginModal from "@/app/hooks/useLoginModal";
import useAuthStore from "@/app/hooks/isloggedin";
import apiService from "@/app/services/apiservice";
import { useRouter } from "next/navigation"
import { useState } from "react";
import Modal from "./Modal";
import Custombutton from "../forms/Custombutton";
import { handleLogin } from "@/app/lib/actions";


const LoginModal = () => {
    const router=useRouter();
    const loginmodal = useLoginModal();
    const {setLoggedIn}=useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setError] = useState<string[]>([]);

    const submitLogin=async()=>{
        const formdata={
            email:email,
            password:password
        }
        const response=await apiService.postWithoutToken('/api/auth/login/',JSON.stringify(formdata));
        console.log('api response',response);
        
        if(response.access){
            handleLogin(response.user.pk,response.access,response.refresh);
            setLoggedIn(true);
            loginmodal.close();
            // router.push('/');
        } else {
            setError(['got error',response.detail]);
        }

    }
    
    const content=(
        <>
         <form 
                action={submitLogin}
                className="space-y-4"
            >
                <input onChange={(e) => setEmail(e.target.value)} placeholder="Your e-mail address" type="email" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />

                <input onChange={(e) => setPassword(e.target.value)} placeholder="Your password" type="password" className="w-full h-[54px] px-4 border border-gray-300 rounded-xl" />
            
                {errors.map((error, index) => {
                    return (
                        <div 
                            key={`error_${index}`}
                            className=" bg-airbnb text-red-800 rounded-xl"
                        >
                            {error}
                        </div>
                    )
                })}

                <Custombutton
                    label="Submit"
                    onclick={submitLogin}
                />
            </form>
        </>
    )
  return (
    <Modal
    isOpen={loginmodal.isOpen}
    close={loginmodal.close}
    label="Login"
    content={content}/>
  )
}

export default LoginModal
