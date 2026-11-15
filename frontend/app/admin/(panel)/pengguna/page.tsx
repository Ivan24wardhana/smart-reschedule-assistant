"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { MemberTable } from "@/features/members/components/MemberTable";

export default function PenggunaPage() {
  const { isAuthorized } = useRequireRole("admin");
  if (!isAuthorized) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Pengguna"
        description="Kelola seluruh pengguna dan anggota (member) Gymnasyum."
      />

      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-2">
          Daftar Keanggotaan
        </h2>
        <p className="text-sm text-[#64748B]">
          Tabel ini menampilkan seluruh pengguna reguler.
        </p>
        <MemberTable />
      </div>
    </div>
  );
}
