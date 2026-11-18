"use client";

import { useEffect } from "react";
import { usePurchaseStore } from "../store/usePurchaseStore";
import { PackageCard } from "./PackageCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Dumbbell } from "lucide-react";

export function PackageCatalog() {
  const {
    packages,
    status,
    error,
    fetchActivePackages,
    selectedPackage,
    setSelectedPackage,
  } = usePurchaseStore();

  useEffect(() => {
    const controller = new AbortController();
    fetchActivePackages(controller.signal);
    return () => controller.abort();
  }, [fetchActivePackages]);

  if (status === "loading") {
    return <LoadingSkeleton count={3} />;
  }

  if (status === "error") {
    return (
      <ErrorState
        message={error || "Gagal memuat katalog paket"}
        onRetry={() => fetchActivePackages()}
      />
    );
  }

  if (packages.length === 0) {
    return (
      <EmptyState
        icon={<Dumbbell size={48} className="text-[#64748B]" />}
        title="Belum Ada Paket"
        description="Saat ini belum ada paket latihan yang tersedia untuk dibeli."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          pkg={pkg}
          isSelected={selectedPackage?.id === pkg.id}
          onSelect={setSelectedPackage}
        />
      ))}
    </div>
  );
}
