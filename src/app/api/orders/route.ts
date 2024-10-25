import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { parse } from "cookie"

// POST Order API
export async function POST(req: Request) {
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
    )
    const userId = decodedToken?.userId

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Fetch user's cart from the database
    const cart = await prisma.cart.findUniqueOrThrow({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Calculate costs based on cart items
    const { tax, total, discount, payable } = calculateCosts({ cart })

    // Create a new address for the user
    const address = await prisma.address.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        address: body.address,
        city: body.city,
        country: body.country,
        phone: body.phone,
      },
    })

    // Create the order
    const order = await prisma.order.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        status: "Processing",
        total,
        tax,
        payable,
        discount,
        shipping: 0,
        address: {
          connect: { id: address.id },
        },
        orderItems: {
          create: cart.items.map((orderItem) => ({
            count: orderItem.count,
            colorId: orderItem.colorId,
            price: orderItem.product.price,
            discount: orderItem.product.discount || 0,
            product: {
              connect: {
                id: orderItem.productId,
              },
            },
          })),
        },
      },
    })

    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    // After creating the order, clear cart items
    await prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } }, // Clear cart items
    })

    return NextResponse.json(
      { message: "Order placed successfully", orderWithItems },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Failed to place order", error },
      { status: 500 }
    )
  }
}

// Helper function to calculate costs from the cart
const calculateCosts = ({ cart }: { cart }) => {
  let total = 0
  let discount = 0

  cart.items.forEach((item) => {
    const productPrice = item.product.price
    const productDiscount = item.product.discount || 0

    total += item.count * productPrice
    discount += productPrice * (productDiscount / 100) * item.count
  })

  const afterDiscount = total - discount
  const tax = afterDiscount * 0.09
  const payable = afterDiscount + tax

  return {
    total: parseFloat(total.toFixed(0)),
    discount: parseFloat(discount.toFixed(0)),
    afterDiscount: parseFloat(afterDiscount.toFixed(0)),
    tax: parseFloat(tax.toFixed(0)),
    payable: parseFloat(payable.toFixed(0)),
  }
}

export async function GET(req: Request) {
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
    )
    const userId = decodedToken?.userId

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        address: true,
        orderItems: {
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

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[ORDERS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
