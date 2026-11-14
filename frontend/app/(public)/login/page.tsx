"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CustomerLoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password, "customer");
    if (success) {
      router.push("/customer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-[#E2E8F0]">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/logo-gymnasyum.webp"
              alt="Gymnasyum Logo"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Selamat Datang</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Masuk untuk melihat dan mengatur jadwal latihan Anda
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#1E293B] font-semibold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#E2E8F0] focus-visible:ring-[#65C466]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-[#1E293B] font-semibold">
                Kata Sandi
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#65C466] hover:underline font-medium">
                Lupa Kata Sandi?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Masukan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#E2E8F0] focus-visible:ring-[#65C466]"
            />
          </div>

          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error === "Invalid credentials"
                ? "Email atau kata sandi salah (Pastikan akun sudah terdaftar)."
                : error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#65C466] hover:bg-[#52a653] text-white font-bold h-11 rounded-lg transition-colors cursor-pointer">
            {isLoading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-[#E2E8F0] pt-6">
          <p className="text-sm text-[#64748B]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-[#65C466] hover:underline font-bold">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
