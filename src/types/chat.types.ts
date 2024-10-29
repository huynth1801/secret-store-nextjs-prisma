export interface Message {
  avatar: string | undefined
  id: string
  content: string
  senderId: string
  receiverId: string
  timestamp: Date
  isAdmin: boolean
}

export interface User {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}
