"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import useAuthStore from "@/app/hooks/isloggedin"; // Zustand store for auth state
import { getAccessToken } from "../lib/actions"; // Import server-side action for token refresh

const AuthInitializer = () => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get("session_access_token");

      if (accessToken) {
        // If an access token exists, validate it
        setLoggedIn(true);
      } else {
        // If no access token, try refreshing the token
        const newAccessToken = await getAccessToken();

        if (newAccessToken) {
          setLoggedIn(true); // Set user as logged in after refreshing token
        } else {
          setLoggedIn(false); // Token refresh failed, keep user logged out
        }
      }
    };

    initializeAuth();
  }, [setLoggedIn]);

  return null; // No need to render anything
};

export default AuthInitializer;
