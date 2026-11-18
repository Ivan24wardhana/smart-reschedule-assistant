// frontend/lib/api/client.ts

import { ApiError } from "./errors";
import { useAuthStore } from "@/stores/useAuthStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

// Variabel global penahan promise agar paralel request tidak memicu multiple refresh token
let refreshPromise: Promise<string | null> | null = null;

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, ...customOptions } = options;
  const store = useAuthStore.getState();

  // 1. TUNGGU HIDRASI SELESAI SEBELUM MENGAMBIL TOKEN
  await store.waitForHydration();

  // 2. Ambil token yang kini sudah dijamin ter-load dengan benar
  const authToken = token || store.getToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  // Eksekusi request pertama
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...customOptions,
  });

  // --- LOGIKA SILENT REFRESH ---
  // Jika 401 dan bukan sedang berada di rute login/refresh, coba perbarui sesi
  if (
    response.status === 401 &&
    !endpoint.includes("/auth/login") &&
    !endpoint.includes("/auth/refresh")
  ) {
    // Pastikan useAuthStore memiliki state refreshToken dan fungsi setTokens
    const refreshToken = (store as any).refreshToken;

    if (refreshToken) {
      if (!refreshPromise) {
        // Kunci proses refresh di dalam satu Promise agar request paralel bisa menunggu
        refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Gagal memuat ulang sesi");
            const data = await res.json();

            // Simpan token baru ke store
            if (typeof (store as any).setTokens === "function") {
              (store as any).setTokens(data.accessToken, data.refreshToken);
            }
            return data.accessToken as string;
          })
          .catch(() => {
            // Jika refresh token gagal (misal sudah expired), barulah paksa logout
            store.logout();
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // Tunggu hingga token baru didapatkan
      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        // Ulangi request yang gagal dengan token baru
        defaultHeaders.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: defaultHeaders,
          ...customOptions,
        });
      }
    } else {
      store.logout();
    }
  }
  // --- END LOGIKA SILENT REFRESH ---

  // Penanganan error standar
  if (!response.ok) {
    if (response.status === 401) {
      store.logout();
      throw new ApiError(
        "Sesi Anda telah berakhir, silakan login kembali.",
        401,
      );
    }

    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new ApiError(
      errorData.message ||
        errorData.error?.message ||
        "Terjadi kesalahan pada server",
      response.status,
      errorData,
    );
  }

  if (response.status === 204) return {} as T;
  return response.json();
}
