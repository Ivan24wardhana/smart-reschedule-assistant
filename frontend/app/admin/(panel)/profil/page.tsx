"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdminProfileForms } from "@/features/admin-profile/components/AdminProfileForms";

export default function AdminProfilePage() {
  const { isAuthorized, isHydrated } = useRequireRole("admin");

  if (!isHydrated || !isAuthorized) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola informasi profil pribadi dan tingkatkan keamanan akun administrator Anda."
      />

      <AdminProfileForms />
    </div>
  );
}
