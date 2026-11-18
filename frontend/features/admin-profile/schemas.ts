import { z } from "zod";

export const adminProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
});
export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;

export const adminPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });
export type AdminPasswordFormData = z.infer<typeof adminPasswordSchema>;
