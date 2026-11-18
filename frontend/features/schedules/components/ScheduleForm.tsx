"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScheduleStore } from "../store/useScheduleStore";
import { useModalStore } from "@/stores/useModalStore";
import {
  scheduleSchema,
  type ScheduleFormData,
  type ScheduleDTO,
} from "../schemas";
import { useCoachServiceOptions } from "../hooks/useCoachServiceOptions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScheduleFormProps {
  scheduleData?: ScheduleDTO;
}

export function ScheduleForm({ scheduleData }: ScheduleFormProps) {
  const { createSchedule, updateSchedule, fetchSchedules } = useScheduleStore();
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatForInput = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      title: scheduleData?.title || "",
      coachId: scheduleData?.coachId || "",
      serviceId: scheduleData?.serviceId || "",
      startsAt: formatForInput(scheduleData?.startsAt),
      endsAt: formatForInput(scheduleData?.endsAt),
      capacity: scheduleData?.capacity || 1,
      status: scheduleData?.status || "available",
    },
  });

  const selectedCoachId = watch("coachId");
  const selectedServiceId = watch("serviceId");
  const { availableCoaches, availableServices, isLoading } =
    useCoachServiceOptions(selectedCoachId, selectedServiceId);

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        startsAt: new Date(data.startsAt).toISOString(),
        endsAt: new Date(data.endsAt).toISOString(),
      };

      if (scheduleData) {
        await updateSchedule(scheduleData.id, payload);
        toast.success("Jadwal berhasil diperbarui");
      } else {
        await createSchedule(payload);
        toast.success("Jadwal baru berhasil dibuat");
      }
      fetchSchedules();
      closeModal();
    } catch (error: any) {
      toast.error(
        error.message ||
          "Gagal menyimpan jadwal. Pastikan tidak ada jadwal bentrok untuk pelatih ini.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">
          Judul Sesi
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          placeholder="Contoh: Yoga Pagi Bersama Budi"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Layanan
          </label>
          <select
            {...register("serviceId")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
            disabled={isLoading}>
            <option value="">Pilih Layanan...</option>
            {availableServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.serviceId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Pelatih
          </label>
          <select
            {...register("coachId")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
            disabled={isLoading}>
            <option value="">Pilih Pelatih...</option>
            {availableCoaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.coachId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.coachId.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Waktu Mulai
          </label>
          <input
            type="datetime-local"
            {...register("startsAt")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          />
          {errors.startsAt && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startsAt.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Waktu Selesai
          </label>
          <input
            type="datetime-local"
            {...register("endsAt")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          />
          {errors.endsAt && (
            <p className="text-red-500 text-xs mt-1">{errors.endsAt.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Kapasitas Maksimal
          </label>
          <input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
            min={1}
          />
          {errors.capacity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.capacity.message}
            </p>
          )}
        </div>

        {scheduleData && (
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
              Status Jadwal
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]">
              <option value="available">Tersedia</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#65C466] hover:bg-green-600 text-white">
          {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
        </Button>
      </div>
    </form>
  );
}
