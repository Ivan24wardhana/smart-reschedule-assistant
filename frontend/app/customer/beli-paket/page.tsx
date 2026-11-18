"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { PageHeader } from "@/components/shared/PageHeader";
import { PackageCatalog } from "@/features/purchase/components/PackageCatalog";
import { CheckoutPanel } from "@/features/purchase/components/CheckoutPanel";

export default function BeliPaketPage() {
  const { isAuthorized, isHydrated } = useRequireRole("customer");

  if (!isHydrated || !isAuthorized) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Beli Paket Latihan"
        description="Pilih paket latihan yang sesuai dengan kebutuhan Anda dan selesaikan pembayaran dengan aman menggunakan Midtrans."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <PackageCatalog />
        </div>

        <div className="lg:col-span-1 h-full">
          <CheckoutPanel />
        </div>
      </div>
    </div>
  );
}
