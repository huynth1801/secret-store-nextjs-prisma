// components/chat/ChatContainer.tsx
import React, { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import { Message } from "@/types/chat.types"
import ChatMessage from "./chat-message"

interface ChatContainerProps {
  onClose?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ChatContainer({ onClose }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      isAdmin: true,
      timestamp: new Date(),
      avatar: "https://static.thenounproject.com/png/1155091-200.png",
      senderId: "",
      receiverId: "",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isAdmin: false,
      timestamp: new Date(),
      avatar: "https://static.thenounproject.com/png/1155091-200.png",
      senderId: "",
      receiverId: "",
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is an AI response.",
        isAdmin: true,
        timestamp: new Date(),
        avatar: undefined,
        senderId: "",
        receiverId: "",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="fixed bottom-20 right-4 w-[400px] overflow-hidden rounded-t-2xl dark:bg-black border border-zinc-800 shadow-2xl">
      <CardHeader className="text-center border-b border-zinc-800">
        <h2 className="text-xl font-semibold dark:text-white">
          Chat with our AI ✨
        </h2>
        <p className="text-sm text-zinc-400">
          Ask any question for our AI to answer
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            variant="secondary"
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            New Chat
          </Button>
          <Button
            variant="secondary"
            className="bg-zinc-800 text-white hover:bg-zinc-700"
          >
            See FAQ
          </Button>
        </div>
      </CardHeader>

      <CardContent ref={scrollRef} className="p-4 overflow-y-auto h-[380px]">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t dark:border-zinc-800 p-4">
        <div className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 dark:bg-zinc-800 border-zinc-700 dark:text-white border-white-700"
            onKeyUp={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-zinc-800 hover:bg-zinc-700"
          >
            <Send className="h-4 w-4 dark:bg-zinc-800" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
