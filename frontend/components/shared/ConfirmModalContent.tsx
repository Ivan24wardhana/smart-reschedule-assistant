"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/stores/useModalStore";
import { Loader2 } from "lucide-react";

interface ConfirmModalContentProps {
  message: string;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
}

export function ConfirmModalContent({
  message,
  onConfirm,
  isSubmitting,
}: ConfirmModalContentProps) {
  const { closeModal } = useModalStore();

  return (
    <div className="space-y-6">
      <p className="text-[#1E293B] font-medium">{message}</p>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <Button
          type="button"
          variant="outline"
          onClick={closeModal}
          disabled={isSubmitting}>
          Batal
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="bg-red-500 hover:bg-red-600 text-white min-w-[100px]"
          onClick={onConfirm}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Ya, Lanjutkan"
          )}
        </Button>
      </div>
    </div>
  );
}
