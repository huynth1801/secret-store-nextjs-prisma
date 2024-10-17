import { Separator } from "@/components/native/separator"
import { Badge } from "@/components/ui/badge"
import type { ProductWithIncludes } from "@/types/prisma"
import Link from "next/link"
import CartButton from "./cart-button"

export const DataSection = async ({
  product,
}: {
  product: ProductWithIncludes
}) => {
  function Price() {
    if (product?.discount > 0) {
      const price = product?.price - product?.discount
      const percentage = product?.discount
      return (
        <div className="flex gap-2 items-center">
          <Badge className="flex gap-4" variant="destructive">
            <div className="line-through">{product?.price} VNĐ</div>
            <div>{percentage}%</div>
          </Badge>
          <h2 className="">{price} VNĐ</h2>
        </div>
      )
    }

    return <h2>${product?.price}</h2>
  }

  return (
    <div className="col-span-2 w-full rounded-lg bg-neutral-100 p-6 dark:bg-neutral-900">
      <h3 className="mb-4 text-xl font-medium">{product.title}</h3>
      <Separator />
      {/* <div className="flex gap-2 mb-2 items-center">
        <p className="text-sm">Brand:</p>
        <Link href={`/products?brand=${product?.brand?.title}`}>
          <Badge variant="outline">{product?.brand?.title}</Badge>
        </Link>
      </div> */}
      <div className="flex gap-2 items-center">
        <p className="text-sm">Categories:</p>
        {product.categories.map(({ title }, index) => (
          <Link key={index} href={`/products?categories=${title}`}>
            <Badge variant="outline">{title}</Badge>
          </Link>
        ))}
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <p className="text-sm">Colors:</p>
        {product.colors.map(({ name, value }, index) => (
          <div key={index} className="flex items-center">
            <div
              className="h-6 w-6 rounded-full border cursor-pointer"
              style={{ backgroundColor: value }}
            />
          </div>
        ))}
      </div>
      <Separator />
      <small>{product.description}</small>

      <Separator />
      <div className="block space-y-2">
        <Price />
        <div className="flex gap-2">
          <CartButton product={product} />
          {/* <WishlistButton product={product} /> */}
        </div>
      </div>
    </div>
  )
}
