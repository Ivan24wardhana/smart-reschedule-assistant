import { z } from "zod";

export const profileSchema = z.object({
  phone: z.string().nullable().optional(),
  emergencyContact: z.string().nullable().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const bodyMetricsSchema = z.object({
  weight: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || Number(val) >= 0,
      "Berat badan tidak boleh negatif",
    ),
  height: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => !val || Number(val) >= 0,
      "Tinggi badan tidak boleh negatif",
    ),
  bloodType: z.string().nullable().optional(),
  medicalHistory: z.string().nullable().optional(),
});

export type BodyMetricsFormData = z.infer<typeof bodyMetricsSchema>;
export interface MemberProfileDTO {
  id: string;
  memberNumber: string;
  userId: string;
  phone: string | null;
  emergencyContact: string | null;
  weight: string | null;
  height: string | null;
  bloodType: string | null;
  medicalHistory: string | null;
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}
