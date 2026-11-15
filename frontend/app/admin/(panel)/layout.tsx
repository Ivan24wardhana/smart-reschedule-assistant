import { Suspense } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { AdminModalHost } from "@/components/layout/AdminModalHost";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-[#64748B]">
          Memuat antarmuka dasbor...
        </div>
      }>
      <AdminShell>
        {children}
        <AdminModalHost />
      </AdminShell>
    </Suspense>
  );
}
