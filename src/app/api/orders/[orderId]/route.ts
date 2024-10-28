import prisma from "@/lib/prisma"
import { parse } from "cookie"
import jwt, { JwtPayload } from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parse(cookieHeader)
    const refreshToken = cookies["refreshToken"]

    if (!refreshToken) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Decode the JWT token to extract userId
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as JwtPayload
    const userId = decodedToken?.userId

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!params.orderId) {
      return new NextResponse("Order id is required", { status: 400 })
    }

    const order = await prisma.order.findUniqueOrThrow({
      where: {
        userId,
        id: params.orderId,
      },
      include: {
        address: true,
        orderItems: {
          include: {
            product: { include: { categories: true } },
          },
        },
        user: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[ORDER_GET]", error)
    return new NextResponse("Internal server", { status: 500 })
  }
}
