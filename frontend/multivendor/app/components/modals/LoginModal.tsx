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
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Store errors for each field
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const submitLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true); // Set loading state
        setErrors({}); // Clear previous errors

        const formdata = {
            email: email,
            password: password
        };

        try {
            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formdata));
            console.log('API response:', response);

            if (response.access) {
                // Successful login
                handleLogin(response.user.pk, response.access, response.refresh);
                setLoggedIn(true, email);
                loginmodal.close();
            } else {
                // Handle login errors
                const tmpErrors: { [key: string]: string } = {};
                if (response.detail) {
                    // General error (e.g., invalid credentials)
                    tmpErrors.general = response.detail;
                } else {
                    // Field-specific errors
                    for (const key in response) {
                        if (Array.isArray(response[key])) {
                            tmpErrors[key] = response[key][0]; // Take the first error message for each field
                        }
                    }
                }
                setErrors(tmpErrors);
            }
        } catch (error: any) {
            // Handle unexpected errors
            setErrors({ general: 'An error occurred while logging in. Please try again.' });
            console.error('Login error:', error);
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
                {/* Email Input */}
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your e-mail address"
                    type="email"
                    className={`w-full h-[54px] px-4 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-xl`}
                    disabled={isLoading} // Disable input when loading
                />
                {errors.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}

                {/* Password Input */}
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    type="password"
                    className={`w-full h-[54px] px-4 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-xl`}
                    disabled={isLoading} // Disable input when loading
                />
                {errors.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                )}

                {/* General Error Message */}
                {errors.general && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-xl">
                        {errors.general}
                    </div>
                )}

                {/* Submit Button */}
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