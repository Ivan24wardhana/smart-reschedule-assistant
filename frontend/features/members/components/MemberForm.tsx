"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberStatusPatchSchema,
  type MemberStatusFormData,
  type MemberWithUserDTO,
} from "../schemas";
import { useMemberStore } from "../store/useMemberStore";
import { useModalStore } from "@/stores/useModalStore";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

interface MemberFormProps {
  memberData: MemberWithUserDTO;
}

export function MemberForm({ memberData }: MemberFormProps) {
  const { updateMemberStatus } = useMemberStore();
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberStatusFormData>({
    resolver: zodResolver(memberStatusPatchSchema),
    defaultValues: { status: memberData.status },
  });

  const onSubmit = async (data: MemberStatusFormData) => {
    setIsSubmitting(true);
    try {
      await updateMemberStatus(memberData.id, data);
      closeModal();
      setTimeout(
        () =>
          toast.success(`Status ${memberData.user?.name} berhasil diperbarui!`),
        300,
      );
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui status pengguna.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm border border-[#E2E8F0]">
        <p>
          <span className="text-[#64748B]">Nama:</span>{" "}
          <strong className="text-[#1E293B]">
            {memberData.user?.name || "Tidak diketahui"}
          </strong>
        </p>
        <p>
          <span className="text-[#64748B]">Nomor Member:</span>{" "}
          <strong className="text-[#1E293B]">{memberData.memberNumber}</strong>
        </p>
      </div>

      <FormField label="Status Keanggotaan" error={errors.status?.message}>
        <select
          {...register("status")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm bg-white">
          <option value="active">Aktif (Dapat memesan jadwal)</option>
          <option value="inactive">Tidak Aktif</option>
          <option value="suspended">Ditangguhkan (Blokir)</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          type="submit"
          className="bg-[#65C466] hover:bg-[#52A353] text-white"
          disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
