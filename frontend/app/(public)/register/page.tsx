"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/useAuthStore";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await register(name, email, password, phone);
    if (success) {
      router.push("/customer");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-8">
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
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Daftar Akun Baru
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Bergabung dengan Gymnasyum untuk mulai latihan
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#1E293B] font-semibold">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukan nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-[#E2E8F0] focus-visible:ring-[#65C466]"
            />
          </div>

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
            <Label htmlFor="phone" className="text-[#1E293B] font-semibold">
              Nomor Telepon (Opsional)
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="Masukan nomor telepon Anda"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-[#E2E8F0] focus-visible:ring-[#65C466]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#1E293B] font-semibold">
              Kata Sandi (Minimal 8 Karakter)
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border-[#E2E8F0] focus-visible:ring-[#65C466]"
            />
          </div>

          {error && (
            <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#65C466] hover:bg-[#52a653] text-white font-bold h-11 rounded-lg transition-colors cursor-pointer mt-2">
            {isLoading ? "Mendaftarkan..." : "Daftar Akun"}
          </Button>
        </form>

        <div className="mt-6 text-center border-t border-[#E2E8F0] pt-4">
          <p className="text-sm text-[#64748B]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-[#65C466] hover:underline font-bold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
