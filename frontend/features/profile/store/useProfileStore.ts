import { create } from "zustand";
import * as memberApi from "@/lib/api/members";
import type { MemberProfileDTO } from "../schemas";

interface ProfileState {
  profile: MemberProfileDTO | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;

  fetchProfile: (signal?: AbortSignal) => Promise<void>;
  updateProfile: (data: Partial<MemberProfileDTO>) => Promise<boolean>;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  status: "idle",
  error: null,

  fetchProfile: async (signal) => {
    set({ status: "loading", error: null });
    try {
      const data = await memberApi.getMyProfile(signal);
      set({ profile: data, status: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({ error: error.message || "Gagal memuat profil", status: "error" });
    }
  },

  updateProfile: async (data) => {
    const { profile } = get();
    if (!profile) return false;

    try {
      const updated = await memberApi.updateProfile(profile.id, data);
      set({ profile: updated });
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  reset: () => set({ profile: null, status: "idle", error: null }),
}));
