import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_BASE_URL } from "@/lib/api/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Aksi
  login: (
    email: string,
    password: string,
    roleType: "admin" | "customer",
  ) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, roleType) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();

          // Validasi tambahan: Pastikan role cocok dengan portal yang diloginkan
          if (data.user.role !== roleType) {
            throw new Error(`Akses ditolak. Anda bukan ${roleType}.`);
          }

          // Simpan token di localStorage (PENTING untuk request selanjutnya)
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error: any) {
          set({
            error: error.message || "Terjadi kesalahan saat login",
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              email,
              password,
              phone: phone?.trim() || null,
            }),
          });

          const data = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(
              data?.error?.message || data?.message || "Registrasi gagal",
            );
          }

          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }

          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          set({
            error: error.message || "Terjadi kesalahan saat registrasi",
            isLoading: false,
            isAuthenticated: false,
          });
          return false;
        }
      },

      logout: async () => {
        // Hapus token dari penyimpanan lokal
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // Nama key di localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
