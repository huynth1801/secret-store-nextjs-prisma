import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { parse } from "cookie"
import jwt from "jsonwebtoken"

export async function GET(req: Request) {
  try {
    // Extract the refreshToken from the cookies
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
    )
    const userId = decodedToken?.userId

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const cart = await prisma.cart.findUniqueOrThrow({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("[ERROR_GET_CART]", error)
    return new NextResponse("Internal server", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Extract the refreshToken from the cookies
    const cookieHeader = req.headers.get("cookie") || ""
    const cookies = parse(cookieHeader)
    const refreshToken = cookies["refreshToken"]
    console.log("refreshToken", refreshToken)

    if (!refreshToken) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Decode the JWT token to extract userId
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    )
    const userId = decodedToken?.userId

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { productId, count } = await req.json()

    if (count < 1) {
      await prisma.cartItem.delete({
        where: { UniqueCartItem: { cartId: userId, productId } },
      })
    } else {
      await prisma.cart.upsert({
        where: {
          userId,
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: {
          items: {
            upsert: {
              where: {
                UniqueCartItem: {
                  cartId: userId,
                  productId,
                },
              },
              update: {
                count,
              },
              create: {
                productId,
                count,
              },
            },
          },
        },
      })
    }

    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(cart)
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
