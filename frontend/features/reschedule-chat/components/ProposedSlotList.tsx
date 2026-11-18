"use client";

import { useChatStore } from "../store/useChatStore";
import { ScheduleCard } from "@/components/shared/ScheduleCard";
import { Button } from "@/components/ui/button";
import { CalendarCheck2 } from "lucide-react";

export function ProposedSlotList() {
  const { currentAnalysis, confirmSchedule } = useChatStore();

  // Hanya render jika intent "Reschedule" dan data rekomendasi tersedia
  if (
    !currentAnalysis ||
    currentAnalysis.intent !== "Reschedule" ||
    currentAnalysis.recommendedSchedules.length === 0
  ) {
    return null;
  }

  return (
    <div className="my-4 space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
      <div className="flex items-center gap-2 text-[#64748B] mb-2">
        <CalendarCheck2 size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Opsi Jadwal Pengganti
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {currentAnalysis.recommendedSchedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            title={schedule.title}
            coachName={schedule.coachName}
            serviceName={schedule.serviceName}
            startsAt={schedule.startsAt}
            endsAt={schedule.endsAt}
            capacity={schedule.remainingCapacity}
            bookedCount={0} // Asumsi sisa kapasitas langsung jadi patokan
            status="available"
            actionButton={
              <Button
                className="w-full bg-[#1E293B] hover:bg-slate-800 text-white mt-3"
                onClick={() => confirmSchedule(schedule.id)}>
                Pilih slot ini
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
