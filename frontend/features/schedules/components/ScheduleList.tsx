"use client";

import { useEffect } from "react";
import { useScheduleStore } from "../store/useScheduleStore";
import { useCoachStore } from "@/features/coaches/store/useCoachStore";
import { useCatalogStore } from "@/features/catalog/store/useCatalogStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ScheduleCard } from "@/components/shared/ScheduleCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function ScheduleList() {
  const { schedules, status, fetchSchedules } = useScheduleStore();
  const { coaches, fetchCoaches } = useCoachStore();
  const { services, fetchServices } = useCatalogStore();
  const { openModal } = useModalStore();
  const { _hasHydrated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated) return;
    fetchCoaches();
    fetchServices();

    const controller = new AbortController();
    fetchSchedules({}, controller.signal);

    return () => controller.abort();
  }, [
    fetchSchedules,
    fetchCoaches,
    fetchServices,
    _hasHydrated,
    isAuthenticated,
  ]);

  if (!_hasHydrated || status === "loading") {
    return <LoadingSkeleton variant="card" count={3} className="mt-6" />;
  }

  if (schedules.length === 0) {
    return (
      <div className="p-10 text-center text-[#64748B] bg-white border border-[#E2E8F0] rounded-xl mt-6">
        Belum ada jadwal yang dijadwalkan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {schedules.map((schedule) => {
        const coachName =
          coaches.find((c) => c.id === schedule.coachId)?.name ||
          "Unknown Coach";
        const serviceName =
          services.find((s) => s.id === schedule.serviceId)?.name ||
          "Unknown Service";

        return (
          <ScheduleCard
            key={schedule.id}
            title={schedule.title}
            coachName={coachName}
            serviceName={serviceName}
            startsAt={schedule.startsAt}
            endsAt={schedule.endsAt}
            capacity={schedule.capacity}
            bookedCount={schedule.bookedCount}
            status={schedule.status}
            actionButton={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  openModal("schedule-form", { scheduleData: schedule })
                }>
                <Edit size={14} className="mr-1.5" /> Edit
              </Button>
            }
          />
        );
      })}
    </div>
  );
}
