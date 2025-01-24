import { create } from "zustand";

interface vendorModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const usevendorModal = create<vendorModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

export default usevendorModal;