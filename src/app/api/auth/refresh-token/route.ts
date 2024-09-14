import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { generateAccessToken } from "@/lib/auth"
import { parse } from "cookie"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "")

  const refreshToken = cookies.refreshToken

  if (!refreshToken) {
    return new NextResponse("No refresh token provided", { status: 401 })
  }

  try {
    // Verify refresh token
    const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

    //If valid, generate a new access token
    const newAccessToken = generateAccessToken(payload?.userId)
    return NextResponse.json({ accessToken: newAccessToken }, { status: 200 })
  } catch (error) {
    console.error("Refresh token verification failed", error)
    return new NextResponse("Invalid refresh token", { status: 403 })
  }
}
