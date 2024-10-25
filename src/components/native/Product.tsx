import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { ProductWithIncludes } from "@/types/prisma"
import Link from "next/link"
import { ImageSkeleton } from "./icons"

export const Product = ({ product }: { product: ProductWithIncludes }) => {
  function Price() {
    if (product?.discount > 0) {
      const price = product?.price - product?.price * (product?.discount / 100)
      const percentage = product?.discount
      return (
        <div className="flex gap-2 items-center">
          <Badge className="flex gap-4" variant="destructive">
            <div className="line-through">
              {product?.price.toLocaleString()} VNĐ
            </div>
            <div>{percentage}%</div>
          </Badge>
          <h2 className="">{price.toLocaleString()} VNĐ</h2>
        </div>
      )
    }

    return <h2>${product?.price}</h2>
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full">
        <CardHeader className="p-0">
          <div className="relative h-60 w-full">
            <Image
              className="rounded-t-lg object-cover"
              src={product?.images[0]}
              alt={`Image for ${product.title}`}
              fill
              sizes="(min-width: 1000px) 30vw, 50vw"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-1 p-4">
          <Badge variant="outline" className="w-min text-neutral-500">
            {product.categories[0].title}
          </Badge>

          <h2 className="mt-2">{product.title}</h2>
          <p className="text-xs text-neutral-500 text-justify">
            {product.description || "No description yet."}
          </p>
        </CardContent>
        <CardFooter>
          {product?.price ? (
            <Price />
          ) : (
            <Badge variant={"secondary"}>Out of stock</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export const ProductGrid = ({
  products,
}: {
  products: ProductWithIncludes[]
}) => {
  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Product product={product} key={product.id} />
      ))}
    </div>
  )
}

export function ProductSkeleton() {
  return (
    <Link href="#">
      <div className="animate-pulse rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="relative h-full w-full">
          <div className="flex h-40 w-full items-center justify-center rounded bg-neutral-300 dark:bg-neutral-700 ">
            <ImageSkeleton />
          </div>
        </div>
        <div className="p-5">
          <div className="w-full">
            <div className="mb-4 h-2.5 w-48 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[480px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[440px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="mb-2.5 h-2 max-w-[460px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-2 max-w-[360px] rounded-full bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const ProductSkeletonGrid = () => {
  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {[...Array(12)].map(() => (
        <ProductSkeleton key={Math.random()} />
      ))}
    </div>
  )
}
