"use client";

import { useEffect } from "react";
import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { useProfileStore } from "@/features/profile/store/useProfileStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileSummary } from "@/features/profile/components/ProfileSummary";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { BodyMetricsForm } from "@/features/profile/components/BodyMetricsForm";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export default function CustomerProfilePage() {
  const { isAuthorized, isHydrated } = useRequireRole("customer");
  const { status, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!isHydrated || !isAuthorized) return;

    const controller = new AbortController();
    fetchProfile(controller.signal);

    return () => controller.abort();
  }, [isHydrated, isAuthorized, fetchProfile]);

  if (!isHydrated || !isAuthorized) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Profil Saya"
        description="Kelola data pribadi, metrik fisik, dan riwayat kesehatan untuk pengalaman berlatih yang lebih optimal."
      />

      {status === "loading" ? (
        <LoadingSkeleton variant="form" count={2} />
      ) : (
        <div className="space-y-6">
          <ProfileSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <ProfileForm />
            <BodyMetricsForm />
          </div>
        </div>
      )}
    </div>
  );
}
