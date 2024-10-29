"use client"

import React, { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useChatStore } from "@/store/chat"
import { Message } from "@/types/chat.types"

const ChatWindow = () => {
  const [newMessage, setNewMessage] = useState("")
  const { messages, activeUserId, addMessage } = useChatStore()
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!newMessage.trim() || !activeUserId) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "admin-id",
      receiverId: activeUserId,
      timestamp: new Date(),
      isAdmin: true,
      avatar: undefined,
    }

    addMessage(message)
    setNewMessage("")
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (!activeUserId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    )
  }

  const filteredMessages = messages.filter(
    (msg) => msg.senderId === activeUserId || msg.receiverId === activeUserId
  )

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isAdmin
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatWindow
