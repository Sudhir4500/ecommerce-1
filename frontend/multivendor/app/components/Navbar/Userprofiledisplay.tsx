
import { useRouter } from "next/navigation";

interface UserprofiledisplayProps {
    username?: string | null;
    email?: string | null;
}



const Userprofiledisplay:React.FC<UserprofiledisplayProps> = ({
    username,
    email
}) => {
    const router = useRouter(); // For redirecting after deletion
  return (
    <div className="px-4 py-2 border-b-2 cursor-pointer
    "
    onClick={() => router.push("/userprofile")}>
        <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
                <p className="font-semibold break-words">{username}</p>
                <p className="text-sm text-gray-600 break-all">{email}</p>

            </div>

        </div>
      
    </div>
  )
}

export default Userprofiledisplay
