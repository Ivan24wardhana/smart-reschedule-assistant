"use client";

import { useModalStore } from "@/stores/useModalStore";
import { DynamicModal } from "@/components/shared/DynamicModal";
import { PackageForm } from "@/features/catalog/components/PackageForm";
import { ConfirmModalContent } from "@/components/shared/ConfirmModalContent";
import { MemberForm } from "@/features/members/components/MemberForm";

export function AdminModalHost() {
  const { isOpen, type, props, closeModal } = useModalStore();

  let title = "";
  let description = "";
  let content = null;

  switch (type) {
    case "package-form":
      title = props.packageData ? "Ubah Paket" : "Tambah Paket Baru";
      description = "Silakan isi detail paket latihan di bawah ini.";
      content = <PackageForm packageData={props.packageData} />;
      break;

    case "confirm":
      title = props.title || "Konfirmasi Tindakan";
      description = props.description || "Apakah Anda yakin?";
      content = (
        <ConfirmModalContent
          message={props.message}
          onConfirm={props.onConfirm}
          isSubmitting={props.isSubmitting}
        />
      );
      break;

    case "member-form":
      title = "Ubah Status Pengguna";
      description = "Ubah hak akses keanggotaan pengguna ini.";
      content = <MemberForm memberData={props.memberData} />;
      break;

    default:
      return null;
  }

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={closeModal}
      title={title}
      description={description}>
      {content}
    </DynamicModal>
  );
}
