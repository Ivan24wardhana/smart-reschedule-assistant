import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center bg-white border border-[#E2E8F0] rounded-xl shadow-sm",
        className,
      )}>
      {icon && <div className="mb-4 text-[#64748B]">{icon}</div>}
      <h3 className="text-lg font-bold text-[#1E293B] mb-2">{title}</h3>
      <p className="text-sm text-[#64748B] mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
