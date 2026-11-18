"use client";

import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatRupiah } from "@/lib/format";
import type { PaymentDTO } from "../schemas";

interface PurchaseHistoryTableProps {
  payments: PaymentDTO[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  onRetry: () => void;
}

export function PurchaseHistoryTable({
  payments,
  status,
  error,
  onRetry,
}: PurchaseHistoryTableProps) {
  const columns = [
    {
      key: "date",
      header: "Tanggal",
      render: (row: PaymentDTO) => {
        const date = new Date(row.createdAt);
        return (
          <span className="text-sm text-[#1E293B]">
            {date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      key: "package",
      header: "Paket",
      render: (row: PaymentDTO) => (
        <div>
          <p className="font-semibold text-[#1E293B] text-sm">
            {row.packageName}
          </p>
          <p className="text-xs text-[#64748B]">{row.reference || "-"}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Total Pembayaran",
      render: (row: PaymentDTO) => (
        <span className="font-medium text-[#1E293B] text-sm">
          {formatRupiah(Number(row.amount))}
        </span>
      ),
    },
    {
      key: "method",
      header: "Metode",
      render: (row: PaymentDTO) => (
        <span className="text-sm text-[#64748B] uppercase">
          {row.method ? row.method.replace("_", " ") : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: PaymentDTO) => (
        <StatusBadge type="payment" status={row.status} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={payments}
      status={status}
      error={error}
      onRetry={onRetry}
      emptyMessage="Anda belum memiliki riwayat transaksi pembelian paket."
    />
  );
}
