import { create } from "zustand";
import { BookingWithScheduleDTO, MOCK_BOOKINGS } from "../schemas";

interface BookingState {
  upcomingBookings: BookingWithScheduleDTO[];
  historyBookings: BookingWithScheduleDTO[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;

  fetchBookings: (signal?: AbortSignal) => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  upcomingBookings: [],
  historyBookings: [],
  status: "idle",
  error: null,

  fetchBookings: async (signal) => {
    set({ status: "loading", error: null });

    try {
      // Simulasi jeda jaringan selama 1.5 detik untuk memicu animasi skeleton
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (signal?.aborted) return;

      // Pemisahan data: "booked" adalah sesi mendatang, sisanya adalah riwayat
      const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "booked");
      const history = MOCK_BOOKINGS.filter((b) => b.status !== "booked");

      set({
        upcomingBookings: upcoming,
        historyBookings: history,
        status: "success",
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        error: error.message || "Gagal memuat daftar jadwal.",
        status: "error",
      });
    }
  },

  reset: () =>
    set({
      upcomingBookings: [],
      historyBookings: [],
      status: "idle",
      error: null,
    }),
}));
