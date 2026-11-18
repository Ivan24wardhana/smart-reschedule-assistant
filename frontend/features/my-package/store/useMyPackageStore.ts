import { create } from "zustand";
import {
  SubscriptionDTO,
  PaymentDTO,
  MOCK_SUBSCRIPTIONS,
  MOCK_PAYMENTS,
} from "../schemas";

interface MyPackageState {
  subscriptions: SubscriptionDTO[];
  payments: PaymentDTO[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;

  fetchMyPackageData: (signal?: AbortSignal) => Promise<void>;
  reset: () => void;
}

export const useMyPackageStore = create<MyPackageState>((set) => ({
  subscriptions: [],
  payments: [],
  status: "idle",
  error: null,

  fetchMyPackageData: async (signal) => {
    set({ status: "loading", error: null });

    try {
      // Simulasi jeda jaringan (network latency) selama 1.5 detik
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulasi pengecekan pembatalan request (AbortController)
      if (signal?.aborted) return;

      // --- KELAK GANTI BAGIAN INI DENGAN PEMANGGILAN API ASLI ---
      // const [subsData, paymentsData] = await Promise.all([
      //   apiClient<SubscriptionDTO[]>("/subscriptions/me", { signal }),
      //   apiClient<PaymentDTO[]>("/payments/me", { signal })
      // ]);

      const subsData = MOCK_SUBSCRIPTIONS;
      const paymentsData = MOCK_PAYMENTS;

      set({
        subscriptions: subsData,
        payments: paymentsData,
        status: "success",
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        error:
          error.message || "Gagal memuat data paket dan riwayat transaksi.",
        status: "error",
      });
    }
  },

  reset: () =>
    set({
      subscriptions: [],
      payments: [],
      status: "idle",
      error: null,
    }),
}));
