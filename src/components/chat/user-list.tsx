import React, { useState } from "react"
import { User } from "@/types/chat.types"
import { useChatStore } from "@/store/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "../ui/scroll-area"

const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const setActiveUser = useChatStore((state) => state.setActiveUser)
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => setActiveUser(user.id)}
          >
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm text-gray-500">
                  {user.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default UserList
