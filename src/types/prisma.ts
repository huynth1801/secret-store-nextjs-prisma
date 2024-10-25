import { Prisma } from "@prisma/client"

export type ProductWithIncludes = Prisma.ProductGetPayload<{
  include: {
    categories: true
    colors: true
  }
}>

export type OrderWithIncludes = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: {
          include: {
            categories: true
          }
        }
      }
    }
    address: true
  }
}>
