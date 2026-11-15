import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type StatusDomain } from "@/lib/constants/status";

interface StatusBadgeProps {
  type: StatusDomain;
  status: string;
  className?: string;
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[type]?.[status];

  const label = config?.label || status;
  const colorClass =
    config?.color || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
        colorClass,
        className,
      )}>
      {label}
    </span>
  );
}
