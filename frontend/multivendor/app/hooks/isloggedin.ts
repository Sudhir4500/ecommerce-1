import { create } from "zustand";

interface AuthStore {
    isLoggedIn: boolean;
    setLoggedIn: (status: boolean) => void;
    logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: false,
    setLoggedIn: (status) => set({ isLoggedIn: status }),
    logout: () => set({ isLoggedIn: false }),
}));

export default useAuthStore;
