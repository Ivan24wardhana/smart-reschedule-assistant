import { AdminShell } from "@/components/layout/AdminShell";
import { AdminModalHost } from "@/components/layout/AdminModalHost";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {children}
      {/* Modal diletakkan di luar konten halaman agar menimpa seluruh layar */}
      <AdminModalHost />
    </AdminShell>
  );
}
