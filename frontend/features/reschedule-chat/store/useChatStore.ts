import { create } from "zustand";
import {
  ChatMessage,
  ChatAnalysis,
  MOCK_INITIAL_MESSAGES,
  MOCK_ANALYSIS_RESPONSE,
  MOCK_ASSISTANT_REPLY,
} from "../schemas";

interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  analysisStatus: "idle" | "pending" | "completed" | "failed";
  currentAnalysis: ChatAnalysis | null;

  // Actions
  initializeSession: (bookingId: string) => void;
  sendMessage: (content: string, clientMessageId: string) => Promise<void>;
  confirmSchedule: (scheduleId: string) => Promise<void>;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessionId: null,
  messages: [...MOCK_INITIAL_MESSAGES],
  isTyping: false,
  analysisStatus: "idle",
  currentAnalysis: null,

  initializeSession: (bookingId) => {
    // Kelak memanggil POST /chat/sessions. Sementara kita set mock session
    set({
      sessionId: `mock-sess-${bookingId}`,
      messages: [...MOCK_INITIAL_MESSAGES],
      currentAnalysis: null,
    });
  },

  sendMessage: async (content, clientMessageId) => {
    // 1. Sinkron tambahkan pesan pengguna ke UI
    const newUserMsg: ChatMessage = {
      id: clientMessageId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newUserMsg],
      isTyping: true,
      analysisStatus: "pending",
      currentAnalysis: null, // Kosongkan analisis sebelumnya
    }));

    try {
      // 2. Simulasi jeda AI (3 detik)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // 3. Masukkan respons AI
      const newAssistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: MOCK_ASSISTANT_REPLY,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, newAssistantMsg],
        isTyping: false,
        analysisStatus: "completed",
        currentAnalysis: MOCK_ANALYSIS_RESPONSE,
      }));
    } catch (error) {
      set({ isTyping: false, analysisStatus: "failed" });
    }
  },

  confirmSchedule: async (scheduleId) => {
    // Simulasi klik "Pilih slot ini"
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role: "system",
          content:
            "Permintaan Anda telah dikirim dan menunggu persetujuan Admin.",
          createdAt: new Date().toISOString(),
        },
      ],
      currentAnalysis: null, // Tutup opsi jadwal setelah dipilih
    }));
  },

  reset: () =>
    set({
      sessionId: null,
      messages: [...MOCK_INITIAL_MESSAGES],
      isTyping: false,
      analysisStatus: "idle",
      currentAnalysis: null,
    }),
}));
