import { ProductGrid, ProductSkeletonGrid } from "@/components/native/Product"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"
import { isVariableValid } from "@/lib/utils"
import { getOrderBy } from "@/lib/utils"
import { Prisma } from "@prisma/client"

interface ProductsProps {
  searchParams: {
    sort?: string
    isAvailable?: string
    category?: string
    page?: number
  }
}

type Product = Prisma.ProductGetPayload<{ include: { categories: true } }>

export default async function Products({ searchParams }: ProductsProps) {
  const { sort, isAvailable, category, page = 1 } = searchParams ?? null

  const orderBy = getOrderBy(sort)

  const categories = await prisma.category.findMany()
  const products = await prisma.product.findMany({
    where: {
      isAvailable: isAvailable === "true" || sort ? true : undefined,
      categories: {
        some: {
          title: {
            contains: category,
            mode: "insensitive",
          },
        },
      },
    },
    orderBy,
    skip: (page - 1) * 12,
    take: 12,
    include: {
      categories: true,
    },
  })
}
