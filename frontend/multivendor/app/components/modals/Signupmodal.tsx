"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignupModal from "@/app/hooks/useSignupModal";
import Custombutton from "../forms/Custombutton";
import apiService from "@/app/services/apiservice";
import useAuthStore from "@/app/hooks/isloggedin";
import Modal from "./Modal";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { handleLogin } from "@/app/lib/actions";

interface FormErrors {
  general?: string;
  email?: string;
  username?: string;
  password1?: string;
  password2?: string;
  [key: string]: string | undefined;
}

const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();
  const { setLoggedIn } = useAuthStore();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = { email, username, password: password1, password2 };

    try {
      const response = await apiService.postWithoutToken("/api/auth/register/", formData);
      console.log("API response:", response);

      if (response.id) {
        setLoggedIn(true, email);
        signupModal.close();
        router.push("/");
      } else {
        const tmpErrors: FormErrors = {};
        for (const key in response) {
          if (Array.isArray(response[key])) {
            tmpErrors[key] = response[key][0];
          }
        }
        setErrors(tmpErrors);
      }
    } catch (error: any) {
      setErrors({ general: error.message || "An error occurred during registration." });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignupSuccess = (credentialResponse: CredentialResponse) => {
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
        // console.log("Google signup response:", response);
        if (response.token && response.token.access) {
          handleLogin(response.user.id, response.token.access, response.token.refresh);
          setLoggedIn(true, response.user.email);
          signupModal.close();
          router.push("/");
        } else {
          setErrors({ general: "Google signup failed." });
        }
      } catch (error: any) {
        setErrors({ general: error.message || "An error occurred with Google signup." });
        console.error("Google signup error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleGoogleSignupError = () => {
    setErrors({ general: "Google signup failed." });
    console.log("Google Signup Failed");
  };

  const content = (
    <>
      <form onSubmit={submitSignup} className="space-y-4">
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          placeholder={errors.email || "Your e-mail address"}
          type="email"
          className={`w-full h-[54px] px-4 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder={errors.username || "Your username"}
          type="text"
          className={`w-full h-[54px] px-4 border ${
            errors.username ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword1(e.target.value)}
          placeholder={errors.password1 || "Your password"}
          type="password"
          className={`w-full h-[54px] px-4 border ${
            errors.password1 ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword2(e.target.value)}
          placeholder={errors.password2 || "Repeat password"}
          type="password"
          className={`w-full h-[54px] px-4 border ${
            errors.password2 ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading}
        />
        {errors.general && (
          <div className="p-5 text-red-800 rounded-xl opacity-80">{errors.general}</div>
        )}
        <Custombutton
          label={isLoading ? "Submitting..." : "Submit"}
          type="submit"
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
          onSuccess={handleGoogleSignupSuccess}
          onError={handleGoogleSignupError}
          useOneTap={true}
          theme="filled_blue"
          size="large"
          text="signup_with"
        />
      </div>
    </>
  );

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <Modal
        isOpen={signupModal.isOpen}
        close={signupModal.close}
        label="Sign up"
        content={content}
      />
    </GoogleOAuthProvider>
  );
};

export default SignupModal;