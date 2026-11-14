import { cn } from "@/lib/utils";

type StatusType = "package" | "member" | "reschedule" | "booking";

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  let label = status;
  let colorClass = "bg-gray-100 text-gray-700 border-gray-200";

  // Mapping untuk Katalog Paket
  if (type === "package") {
    switch (status) {
      case "active":
        label = "Aktif";
        colorClass = "bg-[#65C466]/10 text-[#52A353] border-[#65C466]/20";
        break;
      case "inactive":
        label = "Tidak Aktif";
        colorClass = "bg-orange-50 text-orange-600 border-orange-100";
        break;
      case "archived":
        label = "Diarsipkan";
        colorClass = "bg-gray-100 text-gray-500 border-gray-200";
        break;
    }
  }

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
