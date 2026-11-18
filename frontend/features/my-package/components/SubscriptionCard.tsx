"use client";

import { formatRupiah } from "@/lib/format";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { SubscriptionDTO } from "../schemas";

interface SubscriptionCardProps {
  subscription: SubscriptionDTO;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  // Kalkulasi sisa sesi dan persentase progres
  const remainingSessions =
    subscription.totalSessions - subscription.usedSessions;
  const progressPercent = Math.min(
    (subscription.usedSessions / subscription.totalSessions) * 100,
    100,
  );

  // Kalkulasi sisa masa berlaku
  const expiresDate = new Date(subscription.expiresAt);
  const today = new Date();
  const diffTime = expiresDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format tanggal untuk tampilan UI
  const startDate = new Date(subscription.startsAt).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "short", year: "numeric" },
  );
  const endDate = expiresDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#1E293B]">
            {subscription.packageName}
          </h3>
          <p className="text-sm text-[#64748B] mt-1">
            {startDate} - {endDate}
          </p>
        </div>
        <StatusBadge type="subscription" status={subscription.status} />
      </div>

      <div className="mt-4 flex-grow">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[#64748B]">Progres Kuota</span>
          <span className="font-bold text-[#1E293B]">
            Sisa {remainingSessions} Sesi
          </span>
        </div>
        {/* Container Progress Bar */}
        <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#65C466] h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-[#64748B] mt-2 text-right">
          Terpakai {subscription.usedSessions} dari {subscription.totalSessions}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex justify-between items-center text-sm">
        <span
          className={`font-medium ${diffDays > 0 && diffDays <= 7 ? "text-orange-500" : "text-[#64748B]"}`}>
          {diffDays > 0
            ? `Berlaku ${diffDays} hari lagi`
            : "Masa berlaku habis"}
        </span>
        <span className="font-black text-[#1E293B]">
          {formatRupiah(Number(subscription.amountPaid))}
        </span>
      </div>
    </div>
  );
}
