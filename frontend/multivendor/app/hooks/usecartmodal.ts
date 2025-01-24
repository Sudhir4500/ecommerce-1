import { create } from "zustand";

interface cartModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const usecartModal = create<cartModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

export default usecartModal;