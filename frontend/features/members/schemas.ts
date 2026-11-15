import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.enum(["admin", "customer"]),
});

export const memberSchema = z.object({
  id: z.string(),
  memberNumber: z.string(),
  userId: z.string(),
  phone: z.string().nullable().optional(),
  emergencyContact: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  bloodType: z.string().nullable().optional(),
  medicalHistory: z.string().nullable().optional(),
  status: z.enum(["active", "inactive", "suspended"]),
  joinedAt: z.string(),
});

export const memberStatusPatchSchema = z.object({
  status: z.enum(["active", "inactive", "suspended"]),
});

export type UserDTO = z.infer<typeof userSchema>;
export type MemberDTO = z.infer<typeof memberSchema>;
export type MemberStatusFormData = z.infer<typeof memberStatusPatchSchema>;

export type MemberWithUserDTO = MemberDTO & {
  user?: UserDTO; 
};
