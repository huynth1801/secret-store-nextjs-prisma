import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { comparePassword, generateToken } from "@/lib/auth"

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

    const token = generateToken(user.id)

    return NextResponse.json(
      { message: "Signed in successfully", token },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to sign in", error)
    return new NextResponse("Error signing in", { status: 500 })
  }
}
