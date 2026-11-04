import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AiMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export interface UiState {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  modalData: unknown;
  toastMessage: string | null;
  theme: "dark" | "light";
  pendingSyncCount: number;
  isAiAssistantOpen: boolean;
  aiMessages: AiMessage[];
}

const INITIAL_AI_MESSAGES: AiMessage[] = [
  {
    id: "msg-welcome",
    sender: "ai",
    text: "Selam! I am Beyond AI Assistant, trained on Ethiopian tax regulations (ERCA 15% VAT, Withholding, TOT), NBE compliance, and sector-specific operational KPIs. How can I assist your enterprise today?",
    timestamp: "Just now",
  },
];

const initialState: UiState = {
  sidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  toastMessage: null,
  theme: "dark",
  pendingSyncCount: 1,
  isAiAssistantOpen: false,
  aiMessages: INITIAL_AI_MESSAGES,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ type: string; data?: unknown }>
    ) => {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data ?? null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    showToast: (state, action: PayloadAction<string>) => {
      state.toastMessage = action.payload;
    },
    hideToast: (state) => {
      state.toastMessage = null;
    },
    simulateSync: (state) => {
      state.pendingSyncCount = 0;
      state.toastMessage = "All operations synced to ledger";
    },
    // AI Assistant Reducers
    toggleAiAssistant: (state) => {
      state.isAiAssistantOpen = !state.isAiAssistantOpen;
    },
    openAiAssistant: (state) => {
      state.isAiAssistantOpen = true;
    },
    closeAiAssistant: (state) => {
      state.isAiAssistantOpen = false;
    },
    sendAiMessage: (state, action: PayloadAction<string>) => {
      const userMsg: AiMessage = {
        id: `usr-${Date.now()}`,
        sender: "user",
        text: action.payload,
        timestamp: "Now",
      };
      state.aiMessages.push(userMsg);
    },
    receiveAiReply: (state, action: PayloadAction<string>) => {
      const replyMsg: AiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: action.payload,
        timestamp: "Now",
      };
      state.aiMessages.push(replyMsg);
    },
    clearAiChat: (state) => {
      state.aiMessages = INITIAL_AI_MESSAGES;
    },
  },
});

export const {
  toggleSidebar,
  setTheme,
  openModal,
  closeModal,
  showToast,
  hideToast,
  simulateSync,
  toggleAiAssistant,
  openAiAssistant,
  closeAiAssistant,
  sendAiMessage,
  receiveAiReply,
  clearAiChat,
} = uiSlice.actions;

export default uiSlice.reducer;
