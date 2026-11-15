import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { MemberWithUserDTO } from "../schemas";

interface MemberDetailProps {
  memberData: MemberWithUserDTO;
}

export function MemberDetail({ memberData }: MemberDetailProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Kartu Profil Dasar */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h3 className="text-[#1E293B] font-semibold text-lg border-b pb-3 mb-4">
          Profil Pelanggan
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-[#64748B] mb-1">Nama Lengkap</p>
            <p className="font-medium text-[#1E293B]">
              {memberData.user?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#64748B] mb-1">Email</p>
            <p className="font-medium text-[#1E293B]">
              {memberData.user?.email || "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#64748B] mb-1">Nomor Telepon</p>
              <p className="font-medium text-[#1E293B]">
                {memberData.phone || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">Nomor Member</p>
              <p className="font-mono text-sm text-[#1E293B]">
                {memberData.memberNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-[#64748B] mb-1">Status</p>
              <StatusBadge type="member" status={memberData.status} />
            </div>
            <div>
              <p className="text-xs text-[#64748B] mb-1">Bergabung Sejak</p>
              <p className="text-sm text-[#1E293B]">
                {formatDateTime(memberData.joinedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Metrik & Kesehatan */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
        <h3 className="text-[#1E293B] font-semibold text-lg border-b pb-3 mb-4">
          Metrik Fisik & Medis
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-[#64748B] mb-1">Berat Badan</p>
              <p className="font-semibold text-[#1E293B]">
                {memberData.weight ? `${memberData.weight} kg` : "-"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-[#64748B] mb-1">Tinggi Badan</p>
              <p className="font-semibold text-[#1E293B]">
                {memberData.height ? `${memberData.height} cm` : "-"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-[#64748B] mb-1">Gol. Darah</p>
              <p className="font-semibold text-[#1E293B] text-center">
                {memberData.bloodType || "-"}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-[#64748B] mb-1">Kontak Darurat</p>
            <p className="font-medium text-[#1E293B]">
              {memberData.emergencyContact || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#64748B] mb-1">Riwayat Medis</p>
            <div className="p-3 bg-red-50/50 border border-red-100 rounded-md text-sm text-[#1E293B] min-h-[60px]">
              {memberData.medicalHistory || (
                <span className="text-gray-400 italic">
                  Tidak ada catatan medis.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
