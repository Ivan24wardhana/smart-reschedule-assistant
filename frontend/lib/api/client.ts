import { ApiError } from "./errors";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, headers, ...customOptions } = options;

  // 1. TUNGGU HIDRASI SELESAI SEBELUM MENGAMBIL TOKEN
  await useAuthStore.getState().waitForHydration();

  // 2. Ambil token yang kini sudah dijamin ter-load dengan benar
  const authToken = token || useAuthStore.getState().getToken();

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...customOptions,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Hanya logout jika endpointnya bukan /auth/login
      if (!endpoint.includes("/auth/login")) {
        useAuthStore.getState().logout();
      }
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
