import Carousel from "@/components/native/carousel"
import { ProductGrid, ProductSkeletonGrid } from "@/components/native/Product"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import prisma from "@/lib/prisma"
import { isVariableValid } from "@/lib/utils"

export default async function Index() {
  const products = await prisma.product.findMany({
    include: {
      categories: true,
    },
  })

  const banners = await prisma.banner.findMany({})

  return (
    <div className="flex flex-col border-neutral-200 dark:border-neutral-700">
      <Carousel images={banners.map((obj) => obj.image)} />
      <Separator className="my-8" />
      <Heading title="Products" description="List of products" />
      {isVariableValid(products) ? (
        <ProductGrid products={products} />
      ) : (
        <ProductSkeletonGrid />
      )}
    </div>
  )
}
