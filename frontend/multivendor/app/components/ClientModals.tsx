"use client";

import dynamic from "next/dynamic";

// Dynamically import modals to avoid SSR issues
const LoginModal = dynamic(() => import("./modals/LoginModal"), { ssr: false });
const SignupModal = dynamic(() => import("./modals/Signupmodal"), { ssr: false });
const Vendormodal = dynamic(() => import("./modals/Vendormodal"), { ssr: false });
const Addproducts = dynamic(() => import("./modals/Addproducts"), { ssr: false });

const ClientModals = () => {
  return (
    <>
      <LoginModal />
      <SignupModal />
      <Vendormodal />
      <Addproducts />
    </>
  );
};

export default ClientModals;