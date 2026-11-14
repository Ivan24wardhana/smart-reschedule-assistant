"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";

export default function CustomerDashboardPage() {
  const { isAuthorized } = useRequireRole("customer");

  if (!isAuthorized) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1E293B]">Jadwal Saya</h1>
      <p className="mt-2 text-[#64748B]">
        Daftar sesi latihan dan fitur obrolan Smart Reschedule akan muncul di
        sini.
      </p>
    </div>
  );
}
