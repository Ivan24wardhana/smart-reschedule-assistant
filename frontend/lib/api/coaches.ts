import { apiClient } from "./client";
import type { CoachDTO, CoachFormData } from "@/features/coaches/schemas";

export async function getCoaches(signal?: AbortSignal): Promise<CoachDTO[]> {
  return apiClient<CoachDTO[]>("/coaches", { signal });
}

export async function createCoach(data: CoachFormData): Promise<CoachDTO> {
  return apiClient<CoachDTO>("/coaches", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCoach(
  id: string,
  data: Partial<CoachFormData>,
): Promise<CoachDTO> {
  return apiClient<CoachDTO>(`/coaches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
