import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/providers/ToasterProvider";

// Menggunakan font Inter sesuai PRD
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gymnasyum | Smart Reschedule Assistant",
  description: "Sistem manajemen jadwal dan booking untuk Gymnasyum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
