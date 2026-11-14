"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function useRequireRole(allowedRole: "admin" | "customer") {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Jangan lakukan pengecekan jika Zustand sedang loading
    if (isLoading) return;

    if (!isAuthenticated) {
      // Belum login, arahkan ke login yang sesuai
      router.push(allowedRole === "admin" ? "/admin/login" : "/login");
    } else if (user?.role !== allowedRole) {
      // Sudah login tapi role salah (misal customer mencoba buka /admin)
      // Arahkan kembali ke dasbor masing-masing
      router.push(user?.role === "admin" ? "/admin" : "/customer");
    } else {
      setIsAuthorized(true);
    }
  }, [isAuthenticated, user, allowedRole, router, isLoading]);

  return { isAuthorized, user };
}
