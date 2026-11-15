"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { useMemberStore } from "@/features/members/store/useMemberStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { MemberDetail } from "@/features/members/components/MemberDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { MemberWithUserDTO } from "@/features/members/schemas";

export default function PenggunaDetailPage() {
  const { isAuthorized, isHydrated } = useRequireRole("admin");
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { members, fetchMembers } = useMemberStore();
  const [member, setMember] = useState<MemberWithUserDTO | null>(null);

  useEffect(() => {
    if (!isHydrated || !isAuthorized) return;

    // Jika data members kosong (karena admin merefresh halaman ini langsung),
    // fetch ulang data dari API.
    if (members.length === 0) {
      fetchMembers();
    } else {
      // Cari member berdasarkan ID dari URL
      const found = members.find((m) => m.id === id);
      setMember(found || null);
    }
  }, [id, members, fetchMembers, isHydrated, isAuthorized]);

  if (!isAuthorized) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#1E293B]"
          onClick={() => router.push("/admin/pengguna")}>
          <ArrowLeft size={18} />
        </Button>
        <PageHeader
          title="Detail Pelanggan"
          description="Informasi profil, metrik fisik, dan riwayat aktivitas member."
        />
      </div>

      {member ? (
        <>
          <MemberDetail memberData={member} />
          <div className="bg-white p-10 mt-6 rounded-xl border border-[#E2E8F0] shadow-sm text-center">
            <h3 className="text-lg font-medium text-[#1E293B] mb-2">
              Riwayat Kelas & Paket
            </h3>
            <p className="text-sm text-[#64748B]">
              Tabel riwayat jadwal (bookings) dan langganan paket
              (subscriptions) akan ditampilkan di sini setelah modul tersebut
              selesai diintegrasikan.
            </p>
          </div>
        </>
      ) : (
        <div className="p-10 text-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl">
          Memuat data pelanggan...
        </div>
      )}
    </div>
  );
}
