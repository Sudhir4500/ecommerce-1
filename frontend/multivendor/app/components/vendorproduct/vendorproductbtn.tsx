// components/VendorProductButton.tsx
import React from 'react';
import { useRouter } from "next/navigation";

interface VendorProductButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const VendorProductButton: React.FC<VendorProductButtonProps> = ({
 
  className = '',
  disabled = false,
}) => {
    const router = useRouter();
  return (
    <button
    onClick={() => router.push("/vendorproduct")}
      className={`${className}`}
      disabled={disabled}
     
    >
      View your products
    </button>
  );
};

export default VendorProductButton;