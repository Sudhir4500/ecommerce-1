"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import useAuthStore from "@/app/hooks/isloggedin";
import apiService from "@/app/services/apiservice";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useState } from "react";
import Modal from "./Modal";
import Custombutton from "../forms/Custombutton";
import { handleLogin } from "@/app/lib/actions";

interface FormErrors {
  general?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

const LoginModal = () => {
  const loginmodal = useLoginModal();
  const { setLoggedIn } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
  
    const formdata = { email, password };
  
    try {
      const response = await apiService.postWithoutToken("/api/auth/login/", formdata);
      console.log("API response:", response);
      if (response.access) {
        // Decode the access token to get user_id
        const tokenPayload = JSON.parse(atob(response.access.split('.')[1]));
        const userId = tokenPayload.user_id; // Extract user_id from JWT payload
        handleLogin(userId, response.access, response.refresh);
        setLoggedIn(true, email);
        loginmodal.close();
      } else {
        const tmpErrors: FormErrors = {};
        if (response.detail) {
          tmpErrors.general = response.detail;
        } else {
          for (const key in response) {
            if (Array.isArray(response[key])) {
              tmpErrors[key] = response[key][0];
            }
          }
        }
        setErrors(tmpErrors);
      }
    } catch (error: any) {
      setErrors({ general: error.message || "An error occurred while logging in." });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    (async () => {
      setIsLoading(true);
      setErrors({});
      const token = credentialResponse.credential;
      console.log("Google token:", token); // Log the token
      if (!token) {
        setErrors({ general: "No Google token received." });
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiService.postWithoutToken("/api/auth/social/google-login/", {
          access_token: token,
        });
        console.log("Google login response:", response);
        if (response.token && response.token.access) {
          handleLogin(response.user.id, response.token.access, response.token.refresh);
          setLoggedIn(true, response.user.email);
          loginmodal.close();
        } else {
          setErrors({ general: "Google login failed." });
        }
      } catch (error: any) {
        setErrors({ general: error.message || "An error occurred with Google login." });
        console.error("Google login error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleGoogleLoginError = () => {
    setErrors({ general: "Google login failed." });
    console.log("Google Login Failed");
  };

  const content = (
    <>
      <form onSubmit={submitLogin} className="space-y-4">
        {/* Email Input */}
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder="Your e-mail address"
          type="email"
          className={`w-full h-[54px] px-4 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

        {/* Password Input */}
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Your password"
          type="password"
          className={`w-full h-[54px] px-4 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        {errors.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-100 text-red-800 p-3 rounded-xl">{errors.general}</div>
        )}

        {/* Submit Button */}
        <Custombutton
          label={isLoading ? "Submitting..." : "Submit"}
          type="submit" // Rely on form's onSubmit
          disabled={isLoading}
          className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
        />
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center">
      <GoogleLogin
  onSuccess={handleGoogleLoginSuccess}
  onError={handleGoogleLoginError}
  useOneTap={true}
  theme="filled_blue"
  size="large"
  // scope="openid profile email"  // Ensure these scopes
/>
      </div>
    </>
  );

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Modal
        isOpen={loginmodal.isOpen}
        close={loginmodal.close}
        label="Login"
        content={content}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginModal;