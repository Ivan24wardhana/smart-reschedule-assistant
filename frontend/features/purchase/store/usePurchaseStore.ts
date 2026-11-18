import { create } from "zustand";
import { apiClient } from "@/lib/api/client";

export interface PurchasePackageDTO {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: string;
  totalSessions: number;
  validityDays: number;
  status: "active" | "inactive" | "archived";
}

interface PurchaseState {
  packages: PurchasePackageDTO[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;

  selectedPackage: PurchasePackageDTO | null;

  fetchActivePackages: (signal?: AbortSignal) => Promise<void>;
  setSelectedPackage: (pkg: PurchasePackageDTO | null) => void;
  reset: () => void;
}

export const usePurchaseStore = create<PurchaseState>((set) => ({
  packages: [],
  status: "idle",
  error: null,
  selectedPackage: null,

  fetchActivePackages: async (signal) => {
    set({ status: "loading", error: null });
    try {
      const data = await apiClient<PurchasePackageDTO[]>(
        "/packages?status=active",
        { signal },
      );
      set({ packages: data, status: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        error: error.message || "Gagal memuat katalog paket",
        status: "error",
      });
    }
  },

  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),

  reset: () =>
    set({ packages: [], status: "idle", error: null, selectedPackage: null }),
}));
