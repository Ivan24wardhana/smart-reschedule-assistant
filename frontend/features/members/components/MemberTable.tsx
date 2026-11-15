"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMemberStore } from "../store/useMemberStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import type { MemberWithUserDTO } from "../schemas";
// toast dihapus karena sudah tidak dipakai di sini

export function MemberTable() {
  const { members, status, error, fetchMembers } = useMemberStore();
  const { openModal } = useModalStore();
  const { _hasHydrated, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;

    const controller = new AbortController();
    fetchMembers(controller.signal);
    return () => controller.abort();
  }, [fetchMembers, _hasHydrated, isAuthenticated]);

  const handleViewDetails = (row: MemberWithUserDTO) => {
    router.push(`/admin/pengguna/${row.id}`);
  };

  const columns = [
    {
      key: "name",
      header: "Nama Pengguna",
      render: (row: MemberWithUserDTO) => (
        <div>
          <p className="font-semibold text-[#1E293B]">
            {row.user?.name || (
              <span className="text-gray-400 italic">Memuat...</span>
            )}
          </p>
          <p className="text-xs text-[#64748B]">
            {row.user?.email || "Email tidak tersedia"}
          </p>
        </div>
      ),
    },
    {
      key: "memberNumber",
      header: "ID Member / Telepon",
      render: (row: MemberWithUserDTO) => (
        <div className="text-sm">
          <p className="font-mono font-medium text-[#1E293B]">
            {row.memberNumber}
          </p>
          <p className="text-xs text-[#64748B]">
            {row.phone || "Tidak ada telepon"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: MemberWithUserDTO) => (
        <StatusBadge type="member" status={row.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: MemberWithUserDTO) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#64748B] hover:text-[#1E293B] hover:bg-gray-100"
            onClick={() => handleViewDetails(row)}>
            <Eye size={14} className="mr-1.5" /> Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal("member-form", { memberData: row })}>
            <Edit size={14} className="mr-1.5" /> Ubah Status
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 mt-6">
      {/* Membungkus loading state di dalam kontainer yang sama */}
      {!_hasHydrated ? (
        <div className="p-10 text-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl">
          Memuat sesi yang tersimpan...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          status={status}
          error={error}
          onRetry={() => fetchMembers()}
          emptyMessage="Belum ada customer yang terdaftar."
        />
      )}
    </div>
  );
}
