import { create } from "zustand";

// Modal types: bisa ditambahkan tipe baru seiring perkembangan fitur (Fase 3, Fase 4)
export type ModalType =
  | "package-form"
  | "service-form"
  | "member-form"
  | "confirm";

interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  props: any;

  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  props: {},

  openModal: (type, props = {}) => set({ isOpen: true, type, props }),
  closeModal: () => set({ isOpen: false, type: null, props: {} }),
}));
