'use client';

import { useRouter } from "next/navigation";
import { resetAuthCookies } from '../lib/actions';
import MenuLink from "./Navbar/MenuLink";
import isloggedin from "@/app/hooks/isloggedin";

const LogoutButton: React.FC = () => {
const {logout}=isloggedin();
    const router = useRouter();

    const submitLogout = async () => {
        await resetAuthCookies(); // Ensure cookies are reset before redirecting
        logout();
        router.push('/');
    }

    return (
        <MenuLink
            label="Log out"
            onclick={submitLogout} // Correct capitalization of onClick
        />
    );
}

export default LogoutButton;
