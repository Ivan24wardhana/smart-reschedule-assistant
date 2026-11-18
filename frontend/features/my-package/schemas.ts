export type SubscriptionStatus =
  | "pending"
  | "held"
  | "active"
  | "expired"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface SubscriptionDTO {
  id: string;
  memberId: string;
  packageId: string;
  packageName: string; // Asumsi field ini di-join oleh BE untuk kemudahan UI
  status: SubscriptionStatus;
  startsAt: string;
  expiresAt: string;
  totalSessions: number;
  usedSessions: number;
  amountPaid: string;
}

export interface PaymentDTO {
  id: string;
  memberId: string;
  packageId: string;
  packageName: string; 
  subscriptionId: string | null;
  amount: string;
  status: PaymentStatus;
  method: string | null;
  reference: string | null;
  paidAt: string | null;
  createdAt: string;
}

export const MOCK_SUBSCRIPTIONS: SubscriptionDTO[] = [
  {
    id: "sub-123",
    memberId: "mem-001",
    packageId: "pkg-001",
    packageName: "Paket Pemula (8 Sesi)",
    status: "active",
    startsAt: new Date().toISOString(), 
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
    totalSessions: 8,
    usedSessions: 2,
    amountPaid: "800000.00",
  },
  {
    id: "sub-122",
    memberId: "mem-001",
    packageId: "pkg-002",
    packageName: "Paket Coba-coba (1 Sesi)",
    status: "expired",
    startsAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    totalSessions: 1,
    usedSessions: 1,
    amountPaid: "150000.00",
  },
];

export const MOCK_PAYMENTS: PaymentDTO[] = [
  {
    id: "pay-101",
    memberId: "mem-001",
    packageId: "pkg-003",
    packageName: "Paket Intensif (12 Sesi)",
    subscriptionId: null,
    amount: "1100000.00",
    status: "pending",
    method: null,
    reference: "ORD-202611-001",
    paidAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: "pay-100",
    memberId: "mem-001",
    packageId: "pkg-001",
    packageName: "Paket Pemula (8 Sesi)",
    subscriptionId: "sub-123",
    amount: "800000.00",
    status: "paid",
    method: "qris",
    reference: "ORD-202610-099",
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pay-099",
    memberId: "mem-001",
    packageId: "pkg-002",
    packageName: "Paket Coba-coba (1 Sesi)",
    subscriptionId: "sub-122",
    amount: "150000.00",
    status: "paid",
    method: "bank_transfer",
    reference: "ORD-202609-045",
    paidAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
