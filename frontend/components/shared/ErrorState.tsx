import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-10 text-center bg-red-50 border border-red-100 rounded-xl",
        className,
      )}>
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-lg font-bold text-red-800 mb-2">
        Oops! Ada yang salah
      </h3>
      <p className="text-sm text-red-600 mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-100">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
