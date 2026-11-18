import { create } from "zustand";
import * as coachApi from "@/lib/api/coaches";
import type { CoachDTO, CoachFormData } from "../schemas";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface CoachState {
  coaches: CoachDTO[];
  status: FetchStatus;
  error: string | null;

  fetchCoaches: (signal?: AbortSignal) => Promise<void>;
  createCoach: (data: CoachFormData) => Promise<boolean>;
  updateCoach: (id: string, data: Partial<CoachFormData>) => Promise<boolean>;
  reset: () => void;
}

export const useCoachStore = create<CoachState>((set, get) => ({
  coaches: [],
  status: "idle",
  error: null,

  fetchCoaches: async (signal) => {
    set({ status: "loading", error: null });
    try {
      const data = await coachApi.getCoaches(signal);
      set({ coaches: data, status: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return; 
      set({
        error: error.message || "Gagal memuat data pelatih",
        status: "error",
      });
    }
  },

  createCoach: async (data) => {
    try {
      const newCoach = await coachApi.createCoach(data);
      set((state) => ({
        coaches: [newCoach, ...state.coaches], 
      }));
      return true;
    } catch (error: any) {
      throw error; 
    }
  },

  updateCoach: async (id, data) => {
    try {
      const updatedCoach = await coachApi.updateCoach(id, data);
      set((state) => ({
        coaches: state.coaches.map((coach) =>
          coach.id === id ? updatedCoach : coach,
        ),
      }));
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  reset: () => set({ coaches: [], status: "idle", error: null }),
}));
