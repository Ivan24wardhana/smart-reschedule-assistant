import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/lib/api/client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  waitForHydration: () => Promise<void>;

  login: (email: string, password: string, role: string) => Promise<boolean>;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
  clearError: () => void;
  getToken: () => string | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      waitForHydration: async () => {
        if (get()._hasHydrated) return;
        return new Promise<void>((resolve) => {
          const unsubscribe = useAuthStore.subscribe((state) => {
            if (state._hasHydrated) {
              unsubscribe();
              resolve();
            }
          });
        });
      },

      getToken: () => get().token || undefined,

      login: async (email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient<any>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role }),
          });
          get().setSession(response.user, response.accessToken);
          return true;
        } catch (error: any) {
          set({ error: error.message || "Gagal masuk.", isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      setSession: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: "gymnasyum-auth",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0)
          return { user: null, token: null, isAuthenticated: false };
        return persistedState;
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        setTimeout(() => state?.setHasHydrated(true), 50);
      },
    },
  ),
);
