import io from "socket.io-client"
import { useEffect } from "react"

const socket = io("http://localhost:3001")

export const useSocket = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server")
    })

    socket.on("message", (message) => {
      // Handle incoming message
      console.log("Received message:", message)
    })

    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("message")
    }
  }, [])

  return socket
}
