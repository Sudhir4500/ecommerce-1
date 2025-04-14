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
  const [image, setImage] = useState<File | null>(null);
  const [showPassword1, setShowPassword1] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  const submitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password1);
    formData.append("password2", password2);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await apiService.postWithoutToken("/api/auth/register/", formData);
      if (response.token && response.token.access) {
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

  const handleGoogleSignupSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrors({});
    const token = credentialResponse.credential;
    if (!token) {
      setErrors({ general: "No Google token received." });
      setIsLoading(false);
      return;
    }
    try {
      const response = await apiService.postWithoutToken("/api/auth/social/google-login/", {
        access_token: token,
      });
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
  };

  const handleGoogleSignupError = () => {
    setErrors({ general: "Google signup failed." });
    console.log("Google Signup Failed");
  };

  const renderInputField = (label: string, placeholder: string, value: string, setter: (value: string) => void, error?: string, type: string = "text", toggleVisibility?: () => void, showPassword?: boolean) => (
    <div className="relative">
      <input
        onChange={handleInputChange(setter)}
        placeholder={placeholder}
        type={type}
        value={value}
        className={`w-full h-[54px] px-4 border ${error ? "border-red-500" : "border-gray-300"} rounded-xl`}
        disabled={isLoading}
      />
      {toggleVisibility && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      )}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );

  const content = (
    <>
      <form onSubmit={submitSignup} className="space-y-4">
        {renderInputField("Email", "Your e-mail address", email, setEmail, errors.email, "email")}
        {renderInputField("Username", "Your username", username, setUsername, errors.username)}
        {renderInputField("Password", "Your password", password1, setPassword1, errors.password1, showPassword1 ? "text" : "password", togglePasswordVisibility1, showPassword1)}
        {renderInputField("Repeat Password", "Repeat password", password2, setPassword2, errors.password2, showPassword2 ? "text" : "password", togglePasswordVisibility2, showPassword2)}
        <div className="relative">
          <input
            onChange={handleImageChange}
            type="file"
            accept="image/*"
            className={`w-full h-[54px] px-4 border border-gray-300 rounded-xl`}
            disabled={isLoading}
          />
          <p className="text-gray-600 text-sm mt-1">Optional: Upload a profile picture</p>
        </div>
        {errors.general && <div className="p-5 text-red-800 rounded-xl opacity-80">{errors.general}</div>}
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