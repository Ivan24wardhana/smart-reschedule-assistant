import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col",
        className,
      )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-[#64748B]">{title}</h3>
        {icon && <div className="text-[#64748B]">{icon}</div>}
      </div>
      <div className="text-3xl font-black text-[#1E293B]">{value}</div>
      {description && (
        <p className="text-xs text-[#64748B] mt-2">{description}</p>
      )}
    </div>
  );
}
