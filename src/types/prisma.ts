import { Prisma } from "@prisma/client"

export type ProductWithIncludes = Prisma.ProductGetPayload<{
  include: {
    categories: true
    colors: true
  }
}>
