"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

interface CheckoutResponse {
  snapToken: string;
  paymentId?: string;
}

export function useCheckout() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const processCheckout = async (packageId: string) => {
    setIsProcessing(true);
    try {
      const response = await apiClient<CheckoutResponse>("/payments", {
        method: "POST",
        body: JSON.stringify({ packageId }),
      });

      const { snapToken } = response;

      if (!snapToken) {
        throw new Error("Token pembayaran tidak diterima dari server.");
      }

      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          toast.success("Pembayaran berhasil diproses!");
          setIsProcessing(false);
          router.push("/customer/paket");
        },
        onPending: function (result) {
          toast.info(
            "Pembayaran tertunda. Silakan selesaikan instruksi pembayaran.",
          );
          setIsProcessing(false);
          router.push("/customer/paket"); 
        },
        onError: function (result) {
          toast.error("Transaksi gagal diproses oleh sistem pembayaran.");
          setIsProcessing(false);
        },
        onClose: function () {
          toast.warning(
            "Anda menutup jendela pembayaran sebelum menyelesaikannya.",
          );
          setIsProcessing(false);
        },
      });
    } catch (error: any) {
      toast.error(
        error.message ||
          "Gagal menginisiasi pembayaran. Pastikan layanan tersedia.",
      );
      setIsProcessing(false);
    }
  };

  return {
    processCheckout,
    isProcessing,
  };
}
