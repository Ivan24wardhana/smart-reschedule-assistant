"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function useRequireRole(allowedRole: "admin" | "customer") {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Hanya lakukan pengecekan JIKA proses hidrasi sudah benar-benar selesai
    if (!_hasHydrated) return;
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(allowedRole === "admin" ? "/admin/login" : "/login");
    } else if (user?.role !== allowedRole) {
      router.replace(user?.role === "admin" ? "/admin" : "/customer");
    } else {
      setIsAuthorized(true);
    }
  }, [isAuthenticated, user, allowedRole, router, isLoading, _hasHydrated]);

  return { isAuthorized, user, isHydrated: _hasHydrated };
}
