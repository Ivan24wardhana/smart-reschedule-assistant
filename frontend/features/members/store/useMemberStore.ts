import { create } from "zustand";
import { apiClient } from "@/lib/api/client";
import type {
  MemberDTO,
  UserDTO,
  MemberWithUserDTO,
  MemberStatusFormData,
} from "../schemas";

type FetchStatus = "idle" | "loading" | "success" | "error";

interface MemberState {
  members: MemberWithUserDTO[];
  status: FetchStatus;
  error: string | null;

  fetchMembers: (signal?: AbortSignal) => Promise<void>;
  updateMemberStatus: (id: string, data: MemberStatusFormData) => Promise<void>;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  status: "idle",
  error: null,

  fetchMembers: async (signal) => {
    set({ status: "loading", error: null });
    try {
      // Tidak perlu memanggil localStorage, apiClient mengurus tokennya
      const [membersData, usersData] = await Promise.all([
        apiClient<MemberDTO[]>("/members", { signal }),
        apiClient<UserDTO[]>("/users", { signal }),
      ]);

      const joinedData: MemberWithUserDTO[] = membersData
        .map((member) => {
          const userMatch = usersData.find((u) => u.id === member.userId);
          return { ...member, user: userMatch };
        })
        .filter((member) => member.user?.role === "customer");

      set({ members: joinedData, status: "success" });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      set({
        error: error.message || "Gagal memuat data pengguna",
        status: "error",
      });
    }
  },

  updateMemberStatus: async (id, data) => {
    set({ status: "loading", error: null });
    try {
      await apiClient(`/members/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      await get().fetchMembers();
    } catch (error: any) {
      set({
        error: error.message || "Gagal memperbarui status member",
        status: "error",
      });
      throw error;
    }
  },
}));
