import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(req: Request) {
  const body = await req.json()
  const { username, email, password, confirmPassword } = body

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    // Generate a token
    const token = generateToken(user.id)

    return NextResponse.json(
      { message: "User signed up successfully", token },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error when siging up", error)
    return new NextResponse("Error signing up", { status: 500 })
  }
}
