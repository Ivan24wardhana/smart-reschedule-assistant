export type BookingStatus = "booked" | "cancelled" | "attended" | "no_show";

export interface BookingWithScheduleDTO {
  id: string;
  memberId: string;
  scheduleId: string;
  subscriptionId: string;
  status: BookingStatus;
  bookedAt: string;
  cancelledAt: string | null;
  // Data tambahan yang di-join untuk kebutuhan UI ScheduleCard
  schedule: {
    title: string;
    coachName: string;
    serviceName: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
    bookedCount: number;
    status: "available" | "full" | "cancelled";
  };
}

// Helper untuk membuat tanggal dinamis (besok dan kemarin)
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

export const MOCK_BOOKINGS: BookingWithScheduleDTO[] = [
  {
    id: "book-001",
    memberId: "mem-001",
    scheduleId: "sched-101",
    subscriptionId: "sub-123",
    status: "booked", // Status 'booked' akan masuk ke tab Mendatang
    bookedAt: new Date().toISOString(),
    cancelledAt: null,
    schedule: {
      title: "Yoga Pagi Bersama",
      coachName: "Budi Santoso",
      serviceName: "Yoga",
      startsAt: tomorrow.toISOString(),
      endsAt: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(), // +1 Jam
      capacity: 10,
      bookedCount: 5,
      status: "available",
    },
  },
  {
    id: "book-002",
    memberId: "mem-001",
    scheduleId: "sched-102",
    subscriptionId: "sub-123",
    status: "attended", // Status selain 'booked' akan masuk ke tab Riwayat
    bookedAt: lastWeek.toISOString(),
    cancelledAt: null,
    schedule: {
      title: "Strength Training Dasar",
      coachName: "Siti Aminah",
      serviceName: "Strength",
      startsAt: yesterday.toISOString(),
      endsAt: new Date(yesterday.getTime() + 60 * 60 * 1000).toISOString(),
      capacity: 8,
      bookedCount: 8,
      status: "full",
    },
  },
  {
    id: "book-003",
    memberId: "mem-001",
    scheduleId: "sched-103",
    subscriptionId: "sub-123",
    status: "cancelled",
    bookedAt: new Date(lastWeek.getTime() - 86400000).toISOString(),
    cancelledAt: lastWeek.toISOString(),
    schedule: {
      title: "Pilates Sore",
      coachName: "Budi Santoso",
      serviceName: "Pilates",
      startsAt: new Date(yesterday.getTime() - 86400000).toISOString(),
      endsAt: new Date(
        yesterday.getTime() - 86400000 + 60 * 60 * 1000,
      ).toISOString(),
      capacity: 12,
      bookedCount: 10,
      status: "available",
    },
  },
];
