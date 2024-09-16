"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { parseCookies, setCookie, destroyCookie } from "nookies"

type User = {
  id: string
  username: string
  email: string
}

export const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const getRefreshToken = useCallback(() => {
    if (typeof window !== "undefined") {
      const cookies = parseCookies()
      return cookies.refreshToken
    }
    return null
  }, [])

  const checkAuthentication = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken()
      console.log("refreshToken", refreshToken)

      if (!refreshToken) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        destroyCookie(null, "refreshToken", { path: "/" })
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error checking authentication:", error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [getRefreshToken])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  return { isAuthenticated, loading, user }
}
