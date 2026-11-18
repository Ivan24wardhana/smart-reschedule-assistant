import { create } from "zustand";
import * as scheduleApi from "@/lib/api/schedules";
import type { ScheduleDTO, ScheduleFormData } from "../schemas";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface ScheduleState {
  schedules: ScheduleDTO[];
  status: FetchStatus;
  error: string | null;

  fetchSchedules: (
    filters?: Parameters<typeof scheduleApi.getSchedules>[0],
    signal?: AbortSignal,
  ) => Promise<void>;
  createSchedule: (data: ScheduleFormData) => Promise<boolean>;
  updateSchedule: (
    id: string,
    data: Partial<ScheduleFormData>,
  ) => Promise<boolean>;
  reset: () => void;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: [],
  status: "idle",
  error: null,

  fetchSchedules: async (filters, signal) => {
    set({ status: "loading", error: null });
    try {
      const data = await scheduleApi.getSchedules(filters, signal);
      set({ schedules: data, status: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        error: error.message || "Gagal memuat jadwal latihan",
        status: "error",
      });
    }
  },

  createSchedule: async (data) => {
    try {
      const newSchedule = await scheduleApi.createSchedule(data);
      set((state) => ({
        schedules: [...state.schedules, newSchedule].sort(
          (a, b) =>
            new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        ),
      }));
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  updateSchedule: async (id, data) => {
    try {
      const updatedSchedule = await scheduleApi.updateSchedule(id, data);
      set((state) => ({
        schedules: state.schedules.map((sched) =>
          sched.id === id ? updatedSchedule : sched,
        ),
      }));
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  reset: () => set({ schedules: [], status: "idle", error: null }),
}));
