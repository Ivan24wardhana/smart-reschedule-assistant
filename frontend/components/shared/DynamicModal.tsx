"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DynamicModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: DynamicModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px]", className)}>
        <DialogHeader>
          <DialogTitle className="text-xl text-[#1E293B]">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-[#64748B]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Render Form dari Feature akan masuk ke sini */}
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
