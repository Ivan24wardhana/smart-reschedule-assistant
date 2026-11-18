"use client";

import { useEffect } from "react";
import { useCoachStore } from "../store/useCoachStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import type { CoachDTO } from "../schemas";

export function CoachTable() {
  const { coaches, status, error, fetchCoaches } = useCoachStore();
  const { openModal } = useModalStore();
  const { _hasHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;
    const controller = new AbortController();
    fetchCoaches(controller.signal);
    return () => controller.abort();
  }, [fetchCoaches, _hasHydrated, isAuthenticated]);

  const columns = [
    {
      key: "name",
      header: "Nama & Spesialisasi",
      render: (row: CoachDTO) => (
        <div>
          <p className="font-semibold text-[#1E293B]">{row.name}</p>
          <p className="text-xs text-[#64748B]">{row.specialty || "-"}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Kontak",
      render: (row: CoachDTO) => (
        <p className="text-sm text-[#1E293B]">{row.phone || "-"}</p>
      ),
    },
    {
      key: "services",
      header: "Jumlah Layanan",
      render: (row: CoachDTO) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {row.serviceIds.length} Layanan
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: CoachDTO) => (
        <StatusBadge type="coach" status={row.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: CoachDTO) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("coach-form", { coachData: row })}>
          <Edit size={14} className="mr-1.5" /> Edit
        </Button>
      ),
    },
  ];

  if (!_hasHydrated) {
    return <LoadingSkeleton variant="table" count={5} className="mt-6" />;
  }

  return (
    <div className="space-y-4 mt-6">
      <DataTable
        columns={columns}
        data={coaches}
        status={status}
        error={error}
        onRetry={() => fetchCoaches()}
        emptyMessage="Belum ada pelatih yang terdaftar."
      />
    </div>
  );
}
