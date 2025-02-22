import Image from "next/image";
import Link from "next/link";
import Usernav from "./Usernav";
import { getUserId } from "@/app/lib/actions";
import Search from "../search/Search";
import Carticon from "../cart/Carticon";
import VendorCheck from "../vendorcheck/CheckVendorStatus"; // Import VendorCheck component

const Navbar = async () => {
  const userId = await getUserId(); // Get the current logged-in user's ID

  return (
    <nav className="w-full max-h-[121px] fixed top-0 left-0 py-5 border-b border-gray-200 bg-white z-10 shadow-lg">
      <div className="max-w-[1500px] mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image src="/c++.jpg" width={60} height={40} alt="logo" />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 w-full mx-auto gap-6">
              <Search /> {/* Search component */}
            </div>

            {userId && (
              <div className="cursor-pointer">
                <VendorCheck email={userId}
                className="hidden sm:hidden md:hidden lg:block"
                /> {/* Pass userId as email to VendorCheck */}
              </div>
            )}

            {/* Cart and user nav sections */}
            <div className="cursor-pointer">
              <Carticon /> {/* Cart icon */}
            </div>
            <div className="cursor-pointer space-x-3">
              <Usernav userId={userId} /> {/* User navigation */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;