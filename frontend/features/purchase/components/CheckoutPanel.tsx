"use client";

import { usePurchaseStore } from "../store/usePurchaseStore";
import { useCheckout } from "../hooks/useCheckout";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck } from "lucide-react";

export function CheckoutPanel() {
  const { selectedPackage } = usePurchaseStore();
  const { processCheckout, isProcessing } = useCheckout();

  if (!selectedPackage) {
    return (
      <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <ShoppingCart size={32} className="text-[#64748B]" />
        </div>
        <h3 className="text-lg font-semibold text-[#1E293B]">
          Belum Ada Paket Terpilih
        </h3>
        <p className="text-sm text-[#64748B] mt-2">
          Silakan pilih salah satu paket latihan dari katalog di samping untuk
          melanjutkan pembayaran.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-[#65C466] shadow-sm flex flex-col h-full sticky top-6">
      <h3 className="text-lg font-semibold text-[#1E293B] border-b border-[#E2E8F0] pb-4 mb-4">
        Ringkasan Pembayaran
      </h3>

      <div className="flex-grow space-y-4">
        <div>
          <p className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
            Paket Terpilih
          </p>
          <p className="font-bold text-[#1E293B]">{selectedPackage.name}</p>
        </div>

        <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] space-y-2 text-sm text-[#1E293B]">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Jumlah Sesi</span>
            <span className="font-medium">
              {selectedPackage.totalSessions}x Latihan
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Masa Berlaku</span>
            <span className="font-medium">
              {selectedPackage.validityDays} Hari
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[#64748B] font-medium">Total Bayar</span>
          <span className="text-2xl font-black text-[#65C466]">
            {formatRupiah(Number(selectedPackage.price))}
          </span>
        </div>

        <Button
          onClick={() => processCheckout(selectedPackage.id)}
          disabled={isProcessing}
          className="w-full bg-[#65C466] hover:bg-green-600 text-white h-12 text-base font-bold flex items-center justify-center">
          {isProcessing ? "Memproses..." : "Bayar Sekarang"}
        </Button>

        <p className="text-xs text-center text-[#64748B] mt-4 flex items-center justify-center">
          <ShieldCheck size={14} className="mr-1" />
          Pembayaran aman didukung oleh Midtrans
        </p>
      </div>
    </div>
  );
}
