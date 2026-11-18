import { apiClient } from "./client";
import type {
  ScheduleDTO,
  ScheduleFormData,
} from "@/features/schedules/schemas";

interface ScheduleFilters {
  date?: string; 
  status?: ScheduleDTO["status"];
}

export async function getSchedules(
  filters?: ScheduleFilters,
  signal?: AbortSignal,
): Promise<ScheduleDTO[]> {
  const queryParams = new URLSearchParams();
  if (filters?.date) queryParams.append("date", filters.date);
  if (filters?.status) queryParams.append("status", filters.status);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/schedules?${queryString}` : "/schedules";

  return apiClient<ScheduleDTO[]>(endpoint, { signal });
}

export async function createSchedule(
  data: ScheduleFormData,
): Promise<ScheduleDTO> {
  return apiClient<ScheduleDTO>("/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateSchedule(
  id: string,
  data: Partial<ScheduleFormData>,
): Promise<ScheduleDTO> {
  return apiClient<ScheduleDTO>(`/schedules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
