
interface CustombuttonProps {
    label: string;
    onclick: () => void;
    className?: string;
}

const Custombutton:React.FC<CustombuttonProps> = ({
    label,
    onclick,
    className
}) => {
    return (
        <div 
       
            onClick={onclick}
            className={`w-full py-4 bg-blue-500 hover:bg-dark text-dark text-center rounded-xl transition cursor-pointer ${className}`}
        >
        
            {label}

        </div>
    )
}

export default Custombutton
