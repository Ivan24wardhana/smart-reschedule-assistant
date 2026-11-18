"use client";

import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { PurchasePackageDTO } from "../store/usePurchaseStore";

interface PackageCardProps {
  pkg: PurchasePackageDTO;
  isSelected: boolean;
  onSelect: (pkg: PurchasePackageDTO) => void;
}

export function PackageCard({ pkg, isSelected, onSelect }: PackageCardProps) {
  const pricePerSession = Number(pkg.price) / pkg.totalSessions;

  return (
    <div
      className={`relative flex flex-col p-6 rounded-xl border transition-all duration-200 ${
        isSelected
          ? "border-[#65C466] shadow-md bg-[#F8FAFC]"
          : "border-[#E2E8F0] bg-white hover:border-[#65C466]/50 hover:shadow-sm"
      }`}>
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {pkg.category}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#1E293B] pr-16">{pkg.name}</h3>
        {pkg.description && (
          <p className="text-sm text-[#64748B] mt-1 line-clamp-2">
            {pkg.description}
          </p>
        )}
      </div>

      <div className="mb-6 flex-grow">
        <div className="flex items-baseline text-[#1E293B]">
          <span className="text-2xl font-black">
            {formatRupiah(Number(pkg.price))}
          </span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-[#64748B]">
          <p className="flex justify-between">
            <span>Jumlah Sesi:</span>
            <span className="font-medium text-[#1E293B]">
              {pkg.totalSessions} Sesi
            </span>
          </p>
          <p className="flex justify-between">
            <span>Masa Berlaku:</span>
            <span className="font-medium text-[#1E293B]">
              {pkg.validityDays} Hari
            </span>
          </p>
          <p className="flex justify-between text-xs pt-2 border-t border-[#E2E8F0]">
            <span>Estimasi per sesi:</span>
            <span>{formatRupiah(pricePerSession)}</span>
          </p>
        </div>
      </div>

      <Button
        onClick={() => onSelect(pkg)}
        variant={isSelected ? "outline" : "default"}
        className={`w-full ${
          isSelected
            ? "border-[#65C466] text-[#65C466] hover:bg-[#65C466]/10"
            : "bg-[#65C466] hover:bg-green-600 text-white"
        }`}>
        {isSelected ? "Terpilih" : "Pilih Paket"}
      </Button>
    </div>
  );
}
