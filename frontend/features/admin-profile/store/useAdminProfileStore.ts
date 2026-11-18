import { create } from "zustand";
import * as userApi from "@/lib/api/users";
import { useAuthStore } from "@/stores/useAuthStore";

interface AdminProfileState {
  isUpdatingProfile: boolean;
  isUpdatingPassword: boolean;

  updateProfile: (data: { name: string }) => Promise<boolean>;
  updatePassword: (data: any) => Promise<boolean>;
}

export const useAdminProfileStore = create<AdminProfileState>((set) => ({
  isUpdatingProfile: false,
  isUpdatingPassword: false,

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const { user, setSession } = useAuthStore.getState();
      if (!user) throw new Error("Tidak ada sesi admin");

      const updatedUser = await userApi.updateAdminProfile(user.id, data);

      setSession(
        {
          userId: updatedUser.id,
          role: updatedUser.role,
          name: updatedUser.name,
        },
        useAuthStore.getState().accessToken!,
      );

      return true;
    } catch (error: any) {
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updatePassword: async (data) => {
    set({ isUpdatingPassword: true });
    try {
      await userApi.updateAdminPassword(data);
      return true;
    } catch (error: any) {
      throw error;
    } finally {
      set({ isUpdatingPassword: false });
    }
  },
}));
