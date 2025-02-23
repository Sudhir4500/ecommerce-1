'use client';

import useLoginModal from "@/app/hooks/useLoginModal";
import useAuthStore from "@/app/hooks/isloggedin";
import apiService from "@/app/services/apiservice";

import { useState } from "react";
import Modal from "./Modal";
import Custombutton from "../forms/Custombutton";
import { handleLogin } from "@/app/lib/actions";

const LoginModal = () => {
    const loginmodal = useLoginModal();
    const { setLoggedIn } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setError] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true); // Set loading state

        const formdata = {
            email: email,
            password: password
        };

        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formdata));
            console.log('api response', response);

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh);
                setLoggedIn(true, email);
                loginmodal.close();
            } else {
                // Handle registration errors
                const tmpErrors: { [key: string]: string } = {};
                for (const key in response) {
                  if (Array.isArray(response[key])) {
                    tmpErrors[key] = response[key][0]; // Take the first error message for each field
                  }
                }
                setError(tmpErrors);
                // setError(['Got error', response.detail]);
            }
        } catch (error) {
            setError({ general: 'An error occurred while logging in' });
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const content = (
        <>
            <form
                onSubmit={submitLogin} // Attach submit handler here
                className="space-y-4"
            >
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={errors.email || "Your e-mail address"}
                    type="email"
                    className={`w-full h-[54px] px-4 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-xl`}
                    disabled={isLoading} // Disable input when loading
                />

                <input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={errors.password || "Your password"}
                    type="password"
                    className={`w-full h-[54px] px-4 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-xl`}
                    disabled={isLoading} // Disable input when loading
                />

                {Object.keys(errors).map((key, index) => {
                    return (
                        <div
                            key={`error_${index}`}
                            className="bg-airbnb text-red-800 rounded-xl"
                        >
                            {errors[key]}
                        </div>
                    );
                })}

                <Custombutton
                    label={isLoading ? "Submitting..." : "Submit"} // Change label when loading
                    onclick={submitLogin}
                    type="submit" // Make it a submit button
                    disabled={isLoading} // Disable button when loading
                    className={isLoading ? "opacity-50 cursor-not-allowed" : ""} // Add styles for disabled state
                />
            </form>
        </>
    );

    return (
        <Modal
            isOpen={loginmodal.isOpen}
            close={loginmodal.close}
            label="Login"
            content={content}
        />
    );
};

export default LoginModal;