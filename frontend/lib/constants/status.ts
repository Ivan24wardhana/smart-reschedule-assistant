export type StatusDomain = "package" | "member" | "coach"; 

type StatusConfig = {
  label: string;
  color: string;
};

export const STATUS_CONFIG: Record<
  StatusDomain,
  Record<string, StatusConfig>
> = {
  package: {
    active: {
      label: "Aktif",
      color: "bg-[#65C466]/10 text-[#52A353] border-[#65C466]/20",
    },
    inactive: {
      label: "Tidak Aktif",
      color: "bg-orange-50 text-orange-600 border-orange-100",
    },
    archived: {
      label: "Diarsipkan",
      color: "bg-gray-100 text-gray-500 border-gray-200",
    },
  },
  member: {
    active: {
      label: "Aktif",
      color: "bg-[#65C466]/10 text-[#52A353] border-[#65C466]/20",
    },
    inactive: {
      label: "Tidak Aktif",
      color: "bg-gray-100 text-gray-500 border-gray-200",
    },
    suspended: {
      label: "Ditangguhkan",
      color: "bg-red-50 text-red-600 border-red-100",
    },
  },
  coach: {
    active: {
      label: "Aktif",
      color: "bg-[#65C466]/10 text-[#52A353] border-[#65C466]/20",
    },
    inactive: {
      label: "Tidak Aktif",
      color: "bg-gray-100 text-gray-500 border-gray-200",
    },
    suspended: {
      label: "Ditangguhkan",
      color: "bg-red-50 text-red-600 border-red-100",
    },
  },
};
