"use client";

import { useProfileStore } from "../store/useProfileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { UserCircle } from "lucide-react";

export function ProfileSummary() {
  const { profile } = useProfileStore();
  const { user } = useAuthStore();

  if (!profile || !user) return null;

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] flex items-center space-x-6">
      <div className="bg-[#F8FAFC] p-4 rounded-full border border-[#E2E8F0]">
        <UserCircle size={64} className="text-[#64748B]" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[#1E293B] mb-1">{user.name}</h2>
        <div className="space-y-1 text-sm text-[#64748B]">
          <p>
            Email: <span className="font-medium">{user.email}</span>
          </p>
          <p>
            ID Member:{" "}
            <span className="font-medium">{profile.memberNumber}</span>
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <StatusBadge type="member" status={profile.status} />
            <span className="text-xs">
              Bergabung sejak {formatDateTime(profile.joinedAt).split(" ")[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
