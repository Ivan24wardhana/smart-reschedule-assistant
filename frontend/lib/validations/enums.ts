export const PACKAGE_STATUS = ["active", "inactive", "archived"] as const;
export type PackageStatus = (typeof PACKAGE_STATUS)[number];

export const MEMBER_STATUS = ["active", "inactive", "suspended"] as const;
export type MemberStatus = (typeof MEMBER_STATUS)[number];

export const COACH_STATUS = ["active", "inactive", "suspended"] as const;
export type CoachStatus = (typeof COACH_STATUS)[number];
