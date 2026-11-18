"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfileStore } from "../store/useProfileStore";
import { profileSchema, type ProfileFormData } from "../schemas";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileForm() {
  const { profile, updateProfile } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: profile?.phone || "",
      emergencyContact: profile?.emergencyContact || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      toast.success("Data diri berhasil diperbarui");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui data diri");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl border border-[#E2E8F0] space-y-4">
      <h3 className="text-lg font-semibold text-[#1E293B] mb-4 border-b pb-2">
        Data Diri & Kontak
      </h3>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">
          Nomor Telepon Pribadi
        </label>
        <input
          type="text"
          {...register("phone")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          placeholder="+62..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1">
          Kontak Darurat (Keluarga/Kerabat)
        </label>
        <input
          type="text"
          {...register("emergencyContact")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
          placeholder="+62..."
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="bg-[#65C466] hover:bg-green-600 text-white w-full sm:w-auto">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
