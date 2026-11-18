"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { useMyPackageStore } from "@/features/my-package/store/useMyPackageStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { SubscriptionCard } from "@/features/my-package/components/SubscriptionCard";
import { PurchaseHistoryTable } from "@/features/my-package/components/PurchaseHistoryTable";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus } from "lucide-react";

export default function PaketSayaPage() {
  const router = useRouter();
  const { isAuthorized, isHydrated } = useRequireRole("customer");
  const { subscriptions, payments, status, error, fetchMyPackageData } =
    useMyPackageStore();

  useEffect(() => {
    if (!isHydrated || !isAuthorized) return;

    const controller = new AbortController();
    fetchMyPackageData(controller.signal);

    return () => controller.abort();
  }, [isHydrated, isAuthorized, fetchMyPackageData]);

  if (!isHydrated || !isAuthorized) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket & Kuota Saya"
        description="Pantau sisa kuota latihan Anda, masa berlaku paket, dan riwayat transaksi pembelian.">
        <Button
          className="bg-[#65C466] hover:bg-green-600 text-white"
          onClick={() => router.push("/customer/beli-paket")}>
          <Plus size={16} className="mr-2" /> Beli Paket Baru
        </Button>
      </PageHeader>

      <div>
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">
          Paket Latihan Aktif
        </h2>

        {status === "loading" ? (
          <LoadingSkeleton variant="card" count={2} />
        ) : status === "success" && subscriptions.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={48} className="text-[#64748B]" />}
            title="Belum Ada Paket"
            description="Anda belum memiliki paket latihan yang aktif. Silakan beli paket terlebih dahulu untuk mulai memesan jadwal."
            action={
              <Button
                variant="outline"
                className="mt-4 border-[#65C466] text-[#65C466] hover:bg-green-50"
                onClick={() => router.push("/customer/beli-paket")}>
                Lihat Katalog Paket
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-[#E2E8F0]">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#1E293B]">
            Riwayat Transaksi
          </h2>
          <p className="text-sm text-[#64748B]">
            Daftar seluruh riwayat pembelian paket Anda.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
          <PurchaseHistoryTable
            payments={payments}
            status={status}
            error={error}
            onRetry={() => fetchMyPackageData()}
          />
        </div>
      </div>
    </div>
  );
}
