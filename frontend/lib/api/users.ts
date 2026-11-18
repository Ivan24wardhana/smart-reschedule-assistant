import { apiClient } from "./client";
import type {
  AdminProfileFormData,
  AdminPasswordFormData,
} from "@/features/admin-profile/schemas";

export async function getAdminProfile(signal?: AbortSignal) {
  return apiClient<any>("/auth/me", { signal });
}

export async function updateAdminProfile(
  id: string,
  data: AdminProfileFormData,
) {
  return apiClient<any>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateAdminPassword(
  data: Omit<AdminPasswordFormData, "confirmPassword">,
) {
  return apiClient<any>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
