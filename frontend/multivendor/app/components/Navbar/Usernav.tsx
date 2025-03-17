'use client';

import { useState, useEffect } from "react";
import LogoutButton from "../Logoutbutton";
import MenuLink from "./MenuLink";
import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import VendorCheck from "../vendorcheck/CheckVendorStatus";
import apiService from "@/app/services/apiservice";

interface UserNavProps {
  userId?: string | null;
  email?: string | null;
  username?: string | null;
  image?: string | null;
}

interface ProfileData {
  email?: string;
  username?: string;
  profile: {
    image?: string | null;
    full_name?: string;
    verified?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

const Usernav: React.FC<UserNavProps> = ({ userId }) => {
  const loginModal = useLoginModal();
  const signupModal = useSignupModal();
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.get("/api/auth/profile/");
        setProfile(response);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return (
    <div className="p-2 relative inline-block border rounded-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center"
      >
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="w-[220px] absolute top-[60px] right-0 bg-white border rounded-lg shadow-lg">
          {userId && profile ? (
            <>
              <div className="px-4 py-2 border-b cursor-default">
                <div className="flex items-center space-x-3">
                  {profile.profile.image ? (
                    <img 
                      src={profile.profile.image} 
                      alt="Profile" 
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">{profile.username?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{profile.username}</p>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                </div>
              </div>
              
              <VendorCheck
                email={userId}
                className="lg:hidden"
              />
              <LogoutButton />
            </>
          ) : (
            <>
              <MenuLink
                label="Login"
                onclick={() => {
                  setIsOpen(false);
                  loginModal.open();
                }}
              />
              <MenuLink
                label="Sign Up"
                onclick={() => {
                  setIsOpen(false);
                  signupModal.open();
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Usernav;