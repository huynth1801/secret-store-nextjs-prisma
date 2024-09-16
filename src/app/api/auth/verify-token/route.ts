import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyToken, generateAccessToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token is missing" },
        { status: 400 }
      )
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 })
    }

    // Generate a access token
    const accessToken = generateAccessToken(user.id)

    return NextResponse.json({ user, accessToken }, { status: 200 })
  } catch (error) {
    console.error("Token verification failed:", error)
    return new NextResponse("Invalid token", { status: 401 })
  }
}
