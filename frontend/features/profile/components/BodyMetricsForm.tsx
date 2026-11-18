"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfileStore } from "../store/useProfileStore";
import { bodyMetricsSchema, type BodyMetricsFormData } from "../schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BodyMetricsForm() {
  const { profile, updateProfile } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<BodyMetricsFormData>({
    resolver: zodResolver(bodyMetricsSchema),
    defaultValues: {
      weight: profile?.weight || "",
      height: profile?.height || "",
      bloodType: profile?.bloodType || "",
      medicalHistory: profile?.medicalHistory || "",
    },
  });

  const onSubmit = async (data: BodyMetricsFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success("Metrik fisik berhasil diperbarui");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui metrik fisik");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border border-[#E2E8F0] space-y-4">
      <h3 className="text-lg font-semibold text-[#1E293B] mb-4 border-b pb-2">
        Metrik Fisik & Medis
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Berat Badan (kg)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("weight")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          />
          {errors.weight && (
            <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            step="0.1"
            {...register("height")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          />
          {errors.height && (
            <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">
          Golongan Darah
        </label>
        <select
          {...register("bloodType")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]">
          <option value="">Tidak Diketahui</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="AB">AB</option>
          <option value="O">O</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">
          Riwayat Medis / Cedera
        </label>
        <textarea
          {...register("medicalHistory")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          rows={3}
          placeholder="Jelaskan cedera atau kondisi medis (cth: asma, cedera lutut)..."
        />
        <p className="text-xs text-[#64748B] mt-1">
          Data ini membantu coach menyesuaikan porsi latihan Anda agar aman.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="bg-[#65C466] hover:bg-green-600 text-white w-full sm:w-auto">
          {isSubmitting ? "Menyimpan..." : "Simpan Metrik Fisik"}
        </Button>
      </div>
    </form>
  );
}
