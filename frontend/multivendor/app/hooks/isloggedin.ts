import { create } from "zustand";
 // Access cookies in Next.js (use client/server appropriately)

interface AuthStore {
    isLoggedIn: boolean;
    setLoggedIn: (status: boolean) => void;
    logout: () => void;
    initializeAuth: () => void; // New function to initialize auth state
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    setLoggedIn: (status) => set({ isLoggedIn: status }),
    logout: () => {
        // Clear Zustand state
        set({ isLoggedIn: false });
        // Optional: Clear cookies if needed
    },
    initializeAuth: () => {
        // Check if "session_access_token" exists
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("session_access_token="));
        const isLoggedIn = !!cookieValue; // Check if token exists
        set({ isLoggedIn });
    },
}));

export default useAuthStore;
