"use client";

import { useMemo } from "react";
import { useCoachStore } from "@/features/coaches/store/useCoachStore";
import { useCatalogStore } from "@/features/catalog/store/useCatalogStore";

export function useCoachServiceOptions(
  selectedCoachId?: string,
  selectedServiceId?: string,
) {
  const { coaches } = useCoachStore();
  const { services } = useCatalogStore();

  // Filter Pelatih
  const availableCoaches = useMemo(() => {
    const activeCoaches = coaches.filter((c) => c.status === "active");
    if (!selectedServiceId) return activeCoaches;
    return activeCoaches.filter((c) =>
      c.serviceIds.includes(selectedServiceId),
    );
  }, [coaches, selectedServiceId]);

  // Filter Layanan
  const availableServices = useMemo(() => {
    const activeServices = services.filter((s) => s.active);
    if (!selectedCoachId) return activeServices;

    const selectedCoach = coaches.find((c) => c.id === selectedCoachId);
    if (!selectedCoach) return activeServices;

    return activeServices.filter((s) =>
      selectedCoach.serviceIds.includes(s.id),
    );
  }, [services, coaches, selectedCoachId]);

  return {
    availableCoaches,
    availableServices,
    isLoading: false, 
  };
}
