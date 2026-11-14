import { ApiError } from "./errors";

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

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...customOptions,
  });

  // Jika response tidak OK, parse pesan error dari backend
  if (!response.ok) {
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

  // Jika status 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
