// app/store/useUserStore.ts
import {create} from 'zustand';
import { getUserId } from '../lib/actions'; // Ensure you import this from where you have your getUserId function

interface UserStore {
  userId: string | null;
  setUserId: (id: string | null) => void;
  fetchUserId: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  fetchUserId: async () => {
    try {
      const userId = await getUserId(); // Fetch the userId (this is your API call or logic)
      set({ userId });
    } catch (error) {
      console.error('Error fetching userId:', error);
      set({ userId: null }); // Set userId to null if there is an error
    }
  }
}));
