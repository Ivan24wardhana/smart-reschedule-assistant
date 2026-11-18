"use client";

import { useRequireRole } from "@/features/auth/hooks/useRequireRole";
import { useModalStore } from "@/stores/useModalStore";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScheduleList } from "@/features/schedules/components/ScheduleList";
import { CoachTable } from "@/features/coaches/components/CoachTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default function AdminJadwalPage() {
  const { isAuthorized, isHydrated } = useRequireRole("admin");
  const { openModal } = useModalStore();

  if (!isHydrated || !isAuthorized) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal & Coach"
        description="Pusat pengelolaan jadwal sesi latihan dan direktori pelatih (coach) Gymnasyum."
      />

      <Tabs defaultValue="jadwal" className="w-full">
        {/* Navigasi Tab */}
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="jadwal">Jadwal Latihan</TabsTrigger>
          <TabsTrigger value="coach">Manajemen Coach</TabsTrigger>
        </TabsList>

        <TabsContent value="jadwal" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-semibold text-[#1E293B]">
                Daftar Jadwal
              </h2>
              <p className="text-sm text-[#64748B]">
                Kelola jadwal sesi latihan yang tersedia untuk member.
              </p>
            </div>
            <Button
              className="bg-[#65C466] hover:bg-green-600 text-white w-full sm:w-auto"
              onClick={() => openModal("schedule-form")}>
              <Plus size={16} className="mr-2" /> Buat Jadwal Baru
            </Button>
          </div>
          <ScheduleList />
        </TabsContent>

        <TabsContent value="coach" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-[#E2E8F0]">
            <div>
              <h2 className="text-base font-semibold text-[#1E293B]">
                Direktori Pelatih
              </h2>
              <p className="text-sm text-[#64748B]">
                Kelola data pelatih dan atur relasi layanan keahliannya.
              </p>
            </div>
            <Button
              className="bg-[#65C466] hover:bg-green-600 text-white w-full sm:w-auto"
              onClick={() => openModal("coach-form")}>
              <Plus size={16} className="mr-2" /> Tambah Pelatih
            </Button>
          </div>


          <CoachTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
