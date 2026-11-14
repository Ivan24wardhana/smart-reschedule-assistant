"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
  emptyMessage?: string;
  onRetry?: () => void;
}

export function DataTable<T>({
  columns,
  data,
  status,
  error,
  emptyMessage = "Data tidak ditemukan.",
  onRetry,
}: DataTableProps<T>) {
  // Tampilan saat Loading API
  if (status === "loading" && data.length === 0) {
    return (
      <div className="w-full bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm p-12 flex flex-col items-center justify-center text-[#64748B]">
        <Loader2 size={32} className="animate-spin mb-4 text-[#65C466]" />
        <p>Memuat data...</p>
      </div>
    );
  }

  // Tampilan saat API Error
  if (status === "error") {
    return (
      <div className="w-full bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <span className="text-xl font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
          Gagal Memuat Data
        </h3>
        <p className="text-[#64748B] mb-6 max-w-md">
          {error || "Terjadi kesalahan koneksi."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Coba Lagi
          </button>
        )}
      </div>
    );
  }

  // Tampilan saat Tabel Kosong
  if (data.length === 0) {
    return (
      <div className="w-full bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-[#64748B]">{emptyMessage}</p>
      </div>
    );
  }

  // Tampilan Berhasil (Data Tersedia)
  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E8F0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={`${rowIndex}-${col.key}`}
                    className="px-6 py-4 whitespace-nowrap">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
