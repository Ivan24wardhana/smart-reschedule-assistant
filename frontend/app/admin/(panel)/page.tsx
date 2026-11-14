"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";

export default function AdminDashboardPage() {
  // Hanya dengan 1 baris ini, halaman otomatis terproteksi!
  const { isAuthorized } = useRequireRole("admin");

  if (!isAuthorized) return null; // Tampilkan layar kosong sejenak saat proses redirect

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E293B]">Validasi Reschedule</h1>
      <p className="mt-2 text-[#64748B]">
        Konten antrean request dan draft AI akan muncul di sini nanti.
      </p>
    </div>
  );
}
