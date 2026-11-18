export type ChatRole = "user" | "assistant" | "system";
export type AnalysisStatus = "pending" | "completed" | "failed";
export type ChatIntent =
  | "Reschedule"
  | "Cancel"
  | "Schedule inquiry"
  | "Confirmation"
  | "Other";

// DTO untuk gelembung pesan
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

// DTO untuk opsi jadwal yang direkomendasikan AI
export interface RecommendedSchedule {
  id: string;
  title: string;
  serviceName: string;
  coachName: string;
  startsAt: string;
  endsAt: string;
  remainingCapacity: number;
}

// DTO Hasil Analisis AI
export interface ChatAnalysis {
  intent: ChatIntent;
  confidence: number;
  recommendedSchedules: RecommendedSchedule[];
}

// --- DATA MOCK ---

// Pesan awal dari sistem
export const MOCK_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-sys-1",
    role: "assistant",
    content: "Halo! Ada yang bisa saya bantu terkait jadwal latihan Anda?",
    createdAt: new Date().toISOString(),
  },
];

// Simulasi respons AI jika user meminta "reschedule besok pagi"
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(8, 0, 0, 0);

export const MOCK_ANALYSIS_RESPONSE: ChatAnalysis = {
  intent: "Reschedule",
  confidence: 0.95,
  recommendedSchedules: [
    {
      id: "mock-sched-001",
      title: "Yoga Pagi Pengganti",
      serviceName: "Yoga",
      coachName: "Budi Santoso",
      startsAt: tomorrow.toISOString(),
      endsAt: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
      remainingCapacity: 3,
    },
  ],
};

export const MOCK_ASSISTANT_REPLY =
  "Tentu, saya menemukan jadwal kosong besok pagi untuk sesi Yoga. Apakah Anda ingin pindah ke jadwal ini?";
