import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth"
import { serialize } from "cookie"

export async function POST(req: Request) {
  const body = await req.json()
  const { identifier, password } = body

  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    })

    if (!user) {
      return new NextResponse("Authentication failed", { status: 401 })
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid)
      return new NextResponse("Password is wrong", { status: 401 })

    // Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // Set refresh token in HTTP-only cookie
    const cookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    // Return the access token in the response body
    const response = NextResponse.json({
      message: "Signed in successfully",
      accessToken,
    })
    // Set the refresh token cookie
    response.headers.set("Set-Cookie", cookie)

    return response
  } catch (error) {
    console.error("Failed to sign in", error)
    return new NextResponse("Error signing in", { status: 500 })
  }
}
