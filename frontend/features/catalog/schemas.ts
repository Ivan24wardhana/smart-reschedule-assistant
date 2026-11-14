import { z } from "zod";

export const packageSchema = z.object({
  name: z.string().min(1, "Nama paket wajib diisi"),
  category: z.string().min(1, "Kategori paket wajib diisi"),
  description: z.string().optional().nullable(),
  price: z.coerce
    .number({
      required_error: "Harga wajib diisi",
      invalid_type_error: "Harga harus berupa angka",
    })
    .positive("Harga harus lebih dari 0"),
  totalSessions: z.coerce
    .number({
      required_error: "Total sesi wajib diisi",
      invalid_type_error: "Total sesi harus berupa angka",
    })
    .int("Total sesi harus berupa bilangan bulat")
    .positive("Total sesi harus lebih dari 0"),
  validityDays: z.coerce
    .number({
      required_error: "Masa berlaku wajib diisi",
      invalid_type_error: "Masa berlaku harus berupa angka",
    })
    .int("Masa berlaku harus berupa bilangan bulat")
    .positive("Masa berlaku harus lebih dari 0"),
  status: z.enum(["active", "inactive", "archived"] as const).default("active"),
});

export type PackageFormData = z.infer<typeof packageSchema>;

// Tipe data (DTO) yang sesuai dengan respons backend
export interface PackageDTO {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: string; // Backend Drizzle mengembalikan numeric sebagai string
  totalSessions: number;
  validityDays: number;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  updatedAt: string;
}
