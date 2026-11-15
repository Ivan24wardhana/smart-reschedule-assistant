"use client";

import { useEffect, useState } from "react";
import { useCatalogStore } from "../store/useCatalogStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { toast } from "sonner";
import type { PackageDTO } from "../schemas";

export function PackageTable() {
  const {
    packages,
    packagesStatus,
    packagesError,
    fetchPackages,
    updatePackage,
  } = useCatalogStore();
  const { openModal, closeModal } = useModalStore();
  const { _hasHydrated, isAuthenticated } = useAuthStore();

  const [isDeleting,] = useState(false);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;

    const controller = new AbortController();
    fetchPackages(undefined, controller.signal);
    return () => controller.abort();
  }, [fetchPackages, _hasHydrated, isAuthenticated]);

  const handleDelete = (pkg: PackageDTO) => {
    openModal("confirm", {
      title: "Hapus Paket",
      description: "Tindakan ini akan mengarsipkan paket secara permanen.",
      message: `Apakah Anda yakin ingin menghapus paket "${pkg.name}"? Paket tidak akan tampil lagi di katalog.`,
      isSubmitting: isDeleting,
      onConfirm: async () => {
        useModalStore.setState((state) => ({
          props: { ...state.props, isSubmitting: true },
        }));
        try {
          await updatePackage(pkg.id, { status: "archived" });
          closeModal();
          setTimeout(() => {
            toast.success(`Paket "${pkg.name}" berhasil dihapus.`);
          }, 300);
        } catch (error: any) {
          useModalStore.setState((state) => ({
            props: { ...state.props, isSubmitting: false },
          }));
          toast.error(error.message || "Gagal menghapus paket.");
        }
      },
    });
  };

  const visiblePackages = packages.filter((p) => p.status !== "archived");

  const columns = [
    {
      key: "name",
      header: "Nama Paket",
      render: (row: PackageDTO) => (
        <div>
          <p className="font-semibold text-[#1E293B]">{row.name}</p>
          <p className="text-xs text-[#64748B]">{row.category}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Harga",
      render: (row: PackageDTO) => (
        <span className="font-medium text-[#1E293B]">
          {formatRupiah(row.price)}
        </span>
      ),
    },
    {
      key: "quota",
      header: "Kuota / Masa",
      render: (row: PackageDTO) => (
        <div className="text-sm">
          <p>{row.totalSessions} Sesi</p>
          <p className="text-xs text-[#64748B]">{row.validityDays} Hari</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: PackageDTO) => (
        <StatusBadge type="package" status={row.status} />
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (row: PackageDTO) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal("package-form", { packageData: row })}>
            <Edit size={14} className="mr-1.5" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(row)}>
            <Trash2 size={14} className="mr-1.5" /> Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          className="bg-[#65C466] hover:bg-[#52A353] text-white"
          onClick={() => openModal("package-form", {})}>
          <Plus size={16} className="mr-2" /> Tambah Paket
        </Button>
      </div>

      {!_hasHydrated ? (
        <div className="p-10 text-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl">
          Memuat sesi yang tersimpan...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={visiblePackages}
          status={packagesStatus}
          error={packagesError}
          onRetry={() => fetchPackages()}
          emptyMessage="Belum ada paket yang ditambahkan."
        />
      )}
    </div>
  );
}
