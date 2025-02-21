import { create } from "zustand";

interface AuthStore {
  isLoggedIn: boolean;
  email: string | null;
  setLoggedIn: (status: boolean, email: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  email: null,
  setLoggedIn: (status, email) => set({ isLoggedIn: status, email }),
  logout: () => {
    set({ isLoggedIn: false, email: null });
  },
}));

export default useAuthStore;