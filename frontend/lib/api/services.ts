import { apiClient } from "./client";

export interface ServiceDTO {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mengambil daftar semua layanan
export async function getServices(signal?: AbortSignal): Promise<ServiceDTO[]> {
  return apiClient<ServiceDTO[]>("/services", { signal });
}
