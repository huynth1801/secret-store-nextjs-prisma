import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
  const body = await req.json()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username, email, password } = body

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

    return NextResponse.json(
      { message: "User signed up successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error when siging up", error)
    return new NextResponse("Error signing up", { status: 500 })
  }
}
