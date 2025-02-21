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
  const [errors, setErrors] = useState<string[]>([]);

  const submitSignup = async () => {
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
        const tmpErrors: string[] = Object.values(response).map((error: any) => {
          return error;
        });
        setErrors(tmpErrors);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors(["An error occurred during registration. Please try again."]);
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
          placeholder="Your e-mail address"
          type="email"
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />

        <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          type="text"
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />

        <input
          onChange={(e) => setPassword1(e.target.value)}
          placeholder="Your password"
          type="password"
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />

        <input
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Repeat password"
          type="password"
          className="w-full h-[54px] px-4 border border-gray-300 rounded-xl"
        />

        {errors.map((error, index) => (
          <div
            key={`error_${index}`}
            className="p-5 text-red-800 rounded-xl opacity-80"
          >
            {error}
          </div>
        ))}

        <Custombutton
          label="Submit"
          onclick={submitSignup}
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