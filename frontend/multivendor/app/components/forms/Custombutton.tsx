"use client";

import React from "react";

interface CustomButtonProps {
  label: string;
  onclick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>; // Optional for non-submit buttons
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Custombutton: React.FC<CustomButtonProps> = ({
  label,
  onclick,
  className,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onclick}
      disabled={disabled}
      className={`w-full py-4 bg-blue-500 hover:bg-dark text-dark text-center rounded-xl transition cursor-pointer ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default Custombutton;