"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  packageSchema,
  type PackageFormData,
  type PackageDTO,
} from "../schemas";
import { useCatalogStore } from "../store/useCatalogStore";
import { useModalStore } from "@/stores/useModalStore";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2 } from "lucide-react"; 

interface PackageFormProps {
  packageData?: PackageDTO;
}

export function PackageForm({ packageData }: PackageFormProps) {
  const isEditing = !!packageData;
  const { packages, createPackage, updatePackage } = useCatalogStore();
  const { closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingCategories = Array.from(
    new Set(packages.map((p) => p.category)),
  );
  const [isNewCategory, setIsNewCategory] = useState(
    isEditing && !existingCategories.includes(packageData.category),
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: isEditing
      ? {
          name: packageData.name,
          category: packageData.category,
          description: packageData.description || "",
          price: Number(packageData.price),
          totalSessions: packageData.totalSessions,
          validityDays: packageData.validityDays,
          status: packageData.status,
        }
      : { status: "active" },
  });

  const onSubmit = async (data: PackageFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updatePackage(packageData.id, data);
        closeModal();
        setTimeout(() => toast.success("Paket berhasil diperbarui!"), 300);
      } else {
        await createPackage(data);
        closeModal();
        setTimeout(
          () => toast.success("Paket baru berhasil ditambahkan!"),
          300,
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat menyimpan paket.");
      setIsSubmitting(false);
    }
  };

  const formatNumberInput = (value: string | number) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumberString = (value: string) => value.replace(/\./g, "");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nama Paket" error={errors.name?.message}>
        <input
          {...register("name")}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm"
          placeholder="Misal: Paket Bulking 30 Hari"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Kategori" error={errors.category?.message}>
          {!isNewCategory ? (
            <select
              {...register("category")}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm bg-white"
              onChange={(e) => {
                if (e.target.value === "ADD_NEW") {
                  setIsNewCategory(true);
                  setValue("category", "");
                }
              }}>
              <option value="">Pilih Kategori...</option>
              {existingCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="ADD_NEW" className="font-semibold text-[#65C466]">
                + Tambah Kategori Baru
              </option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                {...register("category")}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm"
                placeholder="Nama kategori..."
                autoFocus
              />
              {existingCategories.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setIsNewCategory(false);
                    setValue("category", existingCategories[0]);
                  }}
                  title="Batal tambah kategori">
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          )}
        </FormField>

        <FormField label="Harga (Rp)" error={errors.price?.message}>
          <Controller
            name="price"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                type="text"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm"
                placeholder="500.000"
                value={formatNumberInput(value || "")}
                onChange={(e) => {
                  const rawValue = parseNumberString(e.target.value);
                  if (/^\d*$/.test(rawValue)) {
                    onChange(rawValue === "" ? undefined : Number(rawValue));
                  }
                }}
              />
            )}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Total Sesi" error={errors.totalSessions?.message}>
          <input
            type="number"
            {...register("totalSessions")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm"
            placeholder="12"
          />
        </FormField>
        <FormField
          label="Masa Berlaku (Hari)"
          error={errors.validityDays?.message}>
          <input
            type="number"
            {...register("validityDays")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm"
            placeholder="30"
          />
        </FormField>
      </div>

      <FormField label="Deskripsi" error={errors.description?.message}>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm resize-none"
          placeholder="Fasilitas yang didapat..."
        />
      </FormField>

      {isEditing && (
        <FormField label="Visibilitas" error={errors.status?.message}>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md text-sm bg-white">
            <option value="active">Aktif (Tampil di Katalog Member)</option>
            <option value="inactive">Tidak Aktif (Disembunyikan)</option>
          </select>
        </FormField>
      )}

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
          {isSubmitting
            ? "Menyimpan..."
            : isEditing
              ? "Simpan Perubahan"
              : "Tambah Paket"}
        </Button>
      </div>
    </form>
  );
}
