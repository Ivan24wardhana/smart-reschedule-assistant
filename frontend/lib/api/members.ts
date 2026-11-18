import { apiClient } from "./client";
import type { MemberProfileDTO } from "@/features/profile/schemas";

export async function getMyProfile(
  signal?: AbortSignal,
): Promise<MemberProfileDTO> {
  return apiClient<MemberProfileDTO>("/members/me", { signal });
}

export async function updateProfile(
  id: string,
  data: Partial<MemberProfileDTO>,
): Promise<MemberProfileDTO> {
  return apiClient<MemberProfileDTO>(`/members/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
