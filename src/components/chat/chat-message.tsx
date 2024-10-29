"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Message } from "@/types/chat.types"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex items-center gap-3 ${
        message.isAdmin ? "" : "flex-row-reverse"
      } `}
    >
      {message.isAdmin ? (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src="https://static.thenounproject.com/png/1155091-200.png"
            className="rounded-full"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="w-8 h-8 dark:bg-white">
          <AvatarImage src={message.avatar} />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg p-3 max-w-[80%] ${
          message.isAdmin
            ? "bg-zinc-800 text-white dark:text-black dark:bg-white"
            : "bg-white text-zinc-900  dark:bg-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
