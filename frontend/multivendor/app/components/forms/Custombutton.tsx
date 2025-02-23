interface CustomButtonProps {
    label: string;
    onclick: (e: React.FormEvent) => void;
    className?: string;
    type?: "button" | "submit" | "reset"; // Add type prop
    disabled?: boolean; // Add disabled prop
}

const Custombutton: React.FC<CustomButtonProps> = ({
    label,
    onclick,
    className,
    type = "button", // Default to "button" if no type is provided
    disabled = false // Default to false if no disabled prop is provided
}) => {
    return (
        <button
            type={type} // Pass the type prop
            onClick={onclick}
            disabled={disabled} // Pass the disabled prop
            className={`w-full py-4 bg-blue-500 hover:bg-dark text-dark text-center rounded-xl transition cursor-pointer ${className} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {label}
        </button>
    );
};

export default Custombutton;