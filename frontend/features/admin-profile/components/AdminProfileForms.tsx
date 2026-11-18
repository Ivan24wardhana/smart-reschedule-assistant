"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  adminProfileSchema,
  adminPasswordSchema,
  type AdminProfileFormData,
  type AdminPasswordFormData,
} from "../schemas";
import { useAdminProfileStore } from "../store/useAdminProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { toast } from "sonner";
import { UserCircle, ShieldCheck } from "lucide-react";

export function AdminProfileForms() {
  const { user } = useAuthStore();
  const {
    isUpdatingProfile,
    isUpdatingPassword,
    updateProfile,
    updatePassword,
  } = useAdminProfileStore();

  const formProfile = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: { name: user?.name || "" },
  });

  const formPassword = useForm<AdminPasswordFormData>({
    resolver: zodResolver(adminPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitProfile = async (data: AdminProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success("Nama profil berhasil diperbarui");
      // Form akan otomatis dirty=false setelah berhasil karena nilai default berubah
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui profil");
    }
  };

  const onSubmitPassword = async (data: AdminPasswordFormData) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(
        "Password berhasil diubah. Silakan gunakan password baru pada login berikutnya.",
      );
      formPassword.reset();
    } catch (error: any) {
      toast.error(
        error.message ||
          "Gagal mengubah password. Pastikan password saat ini benar.",
      );
    }
  };

  if (!user) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Kolom Kiri: Profil & Username */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] flex items-center space-x-4">
          <div className="bg-blue-50 p-4 rounded-full border border-blue-100">
            <ShieldCheck size={48} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] mb-1">
              {user.name}
            </h2>
            <p className="text-sm text-[#64748B]">{user.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded text-xs font-medium bg-gray-100 text-gray-800">
              Administrator System
            </span>
          </div>
        </div>

        <form
          onSubmit={formProfile.handleSubmit(onSubmitProfile)}
          className="bg-white p-6 rounded-xl border border-[#E2E8F0] space-y-4">
          <h3 className="text-lg font-semibold text-[#1E293B] mb-4 border-b pb-2 flex items-center">
            <UserCircle size={20} className="mr-2 text-[#64748B]" /> Data Profil
          </h3>

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
              Email (Read-Only)
            </label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
              Nama Tampilan
            </label>
            <input
              type="text"
              {...formProfile.register("name")}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-1 focus:ring-[#65C466]"
            />
            {formProfile.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {formProfile.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="pt-2 text-right">
            <Button
              type="submit"
              disabled={!formProfile.formState.isDirty || isUpdatingProfile}
              className="bg-[#65C466] hover:bg-green-600 text-white">
              {isUpdatingProfile ? "Menyimpan..." : "Simpan Nama"}
            </Button>
          </div>
        </form>
      </div>

      {/* Kolom Kanan: Keamanan (Password) */}
      <form
        onSubmit={formPassword.handleSubmit(onSubmitPassword)}
        className="bg-white p-6 rounded-xl border border-[#E2E8F0] space-y-4">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-4 border-b pb-2 text-red-600">
          Ubah Password
        </h3>

        <p className="text-sm text-[#64748B] mb-4">
          Sangat disarankan untuk segera mengubah password default Anda untuk
          alasan keamanan.
        </p>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Password Saat Ini
          </label>
          <PasswordInput
            {...formPassword.register("currentPassword")}
            placeholder="Masukkan password saat ini"
          />
          {formPassword.formState.errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formPassword.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Password Baru
          </label>
          <PasswordInput
            {...formPassword.register("newPassword")}
            placeholder="Minimal 8 karakter"
          />
          {formPassword.formState.errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formPassword.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Konfirmasi Password Baru
          </label>
          <PasswordInput
            {...formPassword.register("confirmPassword")}
            placeholder="Ulangi password baru"
          />
          {formPassword.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formPassword.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-2 text-right">
          <Button
            type="submit"
            disabled={!formPassword.formState.isValid || isUpdatingPassword}
            className="bg-red-500 hover:bg-red-600 text-white">
            {isUpdatingPassword ? "Memproses..." : "Perbarui Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
