"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSignupModal from "@/app/hooks/useSignupModal";
import Custombutton from "../forms/Custombutton";
import apiService from "@/app/services/apiservice";
import useAuthStore from "@/app/hooks/isloggedin";
import Modal from "./Modal";

const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();
  const { setLoggedIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Object to store field-specific errors
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const submitSignup = async () => {
    setIsLoading(true); // Set loading state to true
    const formData = {
      email: email,
      username: username,
      password: password1,
      password2: password2,
    };

    try {
      const response = await apiService.postWithoutToken("/api/auth/register/", JSON.stringify(formData));
      console.log("api response", response);

      if (response.id) {
        // Trigger login after successful signup
        setLoggedIn(true, email);

        // Close the signup modal and redirect
        signupModal.close();
        router.push("/");
      } else {
        // Handle registration errors
        const tmpErrors: { [key: string]: string } = {};
        for (const key in response) {
          if (Array.isArray(response[key])) {
            tmpErrors[key] = response[key][0]; // Take the first error message for each field
          }
        }
        setErrors(tmpErrors);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "An error occurred during registration. Please try again." });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const content = (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSignup();
        }}
        className="space-y-4"
      >
        <input
          onChange={(e) => setEmail(e.target.value)}
          placeholder={errors.email || "Your e-mail address"} // Show error as placeholder
          type="email"
          className={`w-full h-[54px] px-4 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading} // Disable input when loading
        />

        <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder={errors.username || "Your username"} // Show error as placeholder
          type="text"
          className={`w-full h-[54px] px-4 border ${
            errors.username ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading} // Disable input when loading
        />

        <input
          onChange={(e) => setPassword1(e.target.value)}
          placeholder={errors.password1 || "Your password"} // Show error as placeholder
          type="password"
          className={`w-full h-[54px] px-4 border ${
            errors.password1 ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading} // Disable input when loading
        />

        <input
          onChange={(e) => setPassword2(e.target.value)}
          placeholder={errors.password2 || "Repeat password"} // Show error as placeholder
          type="password"
          className={`w-full h-[54px] px-4 border ${
            errors.password2 ? "border-red-500" : "border-gray-300"
          } rounded-xl`}
          disabled={isLoading} // Disable input when loading
        />

        {errors.general && ( // Display general errors (e.g., network errors)
          <div className="p-5 text-red-800 rounded-xl opacity-80">
            {errors.general}
          </div>
        )}

        <Custombutton
          label={isLoading ? "Submitting..." : "Submit"} // Update button label when loading
          onclick={submitSignup}
          type="submit" // Make it a submit button
          disabled={isLoading} // Disable button when loading
          className={isLoading ? "opacity-50 cursor-not-allowed" : ""} // Add styles for disabled state
        />
      </form>
    </>
  );

  return (
    <Modal
      isOpen={signupModal.isOpen}
      close={signupModal.close}
      label="Sign up"
      content={content}
    />
  );
};

export default SignupModal;