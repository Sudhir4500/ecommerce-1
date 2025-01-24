import Image from "next/image";
import Link from "next/link";
import Usernav from "./Usernav";
import BecomeVendorButton from "./BecomeVendorButton";

import { getUserId } from "@/app/lib/actions";
import AddpropertyButton from "./AddpropertyButton";
import Search from "../search/Search";
import Carticon from "../cart/Carticon";

const Navbar = async () => {
  const userId = await getUserId();
  return (
    <nav className=" w-full max-h-[121px] fixed top-0 left-0 py-5 border-b border-gray-200 bg-white z-10 shadow-lg">
      <div className=" max-w-[1500px] mx-auto px-6 ">
        <div className=" flex items-center justify-between">
          <div>
            <Link href="/">
              <Image src="/c++.jpg" width={60} height={40} alt="logo" />
            </Link>
          </div>
          <div className=" flex items-center space-x-6">
            <div className=" flex items-center space-x-3 w-2/3 gap-6 ">
              <Search />
            </div>
            <div className=" cursor-pointer">
              {/* <BecomeVendorButton userId={userId} /> */}
              {/* <AddpropertyButton /> */}
            </div>
            <div className=" cursor-pointer">
              <Carticon />
              </div>
            <div className=" cursor-pointer space-x-3">
              <Usernav userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
