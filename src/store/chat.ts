import { Message } from "@/types/chat.types"
import { create } from "zustand"

interface ChatState {
  messages: Message[]
  activeUserId: string | null
  setActiveUser: (userId: string) => void
  addMessage: (message: Message) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeUserId: null,
  setActiveUser: (userId) => set({ activeUserId: userId }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}))
