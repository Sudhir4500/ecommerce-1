import { create } from "zustand";

interface propertylistingModalStore {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const usepropertylistingModal = create<propertylistingModalStore>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}));

export default usepropertylistingModal;