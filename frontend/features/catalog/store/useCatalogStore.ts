import { create } from "zustand";
import { apiClient } from "@/lib/api/client";
import type { PackageDTO, PackageFormData } from "../schemas";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface CatalogState {
  packages: PackageDTO[];
  packagesStatus: FetchStatus;
  packagesError: string | null;

  fetchPackages: (
    status?: PackageDTO["status"],
    signal?: AbortSignal,
  ) => Promise<void>;
  createPackage: (data: PackageFormData) => Promise<void>;
  updatePackage: (id: string, data: Partial<PackageFormData>) => Promise<void>;
  reset: () => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  packages: [],
  packagesStatus: "idle",
  packagesError: null,

  fetchPackages: async (status, signal) => {
    set({ packagesStatus: "loading", packagesError: null });
    try {
      const query = status ? `?status=${status}` : "";
      // Ambil token dari localStorage
      const token = localStorage.getItem("accessToken") || undefined;

      const data = await apiClient<PackageDTO[]>(`/packages${query}`, {
        signal,
        token,
      });
      set({ packages: data, packagesStatus: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        packagesError: error.message || "Gagal memuat paket",
        packagesStatus: "error",
      });
    }
  },

  createPackage: async (data) => {
    set({ packagesStatus: "loading", packagesError: null });
    try {
      const token = localStorage.getItem("accessToken") || undefined;
      await apiClient("/packages", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      });
      await get().fetchPackages();
    } catch (error: any) {
      set({
        packagesError: error.message || "Gagal menambah paket",
        packagesStatus: "error",
      });
      throw error;
    }
  },

  updatePackage: async (id, data) => {
    set({ packagesStatus: "loading", packagesError: null });
    try {
      const token = localStorage.getItem("accessToken") || undefined;
      await apiClient(`/packages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        token,
      });
      await get().fetchPackages();
    } catch (error: any) {
      set({
        packagesError: error.message || "Gagal memperbarui paket",
        packagesStatus: "error",
      });
      throw error;
    }
  },

  reset: () =>
    set({
      packages: [],
      packagesStatus: "idle",
      packagesError: null,
    }),
}));
