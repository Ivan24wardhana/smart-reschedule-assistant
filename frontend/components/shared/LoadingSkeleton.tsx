import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  count = 1,
  className,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-xl border border-[#E2E8F0] bg-white shadow-sm flex flex-col h-[300px]">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-4/5 mb-8" />

          <Skeleton className="h-8 w-1/3 mb-4" />

          <div className="mt-auto space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-between mt-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>

          <Skeleton className="h-10 w-full mt-4" />
        </div>
      ))}
    </div>
  );
}
