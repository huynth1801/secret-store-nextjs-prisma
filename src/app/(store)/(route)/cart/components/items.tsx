"use client"

import { Spinner } from "@/components/native/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MinusIcon, PlusIcon, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Product } from "@prisma/client"
import useCartStore from "@/store/useCartStore"

export interface CartItemProps {
  cartItem: {
    product: Product
    productId: string
    colorId: string
    count: number
  }
  authenticated: boolean
}

export const Item = ({ cartItem, authenticated }: CartItemProps) => {
  const { product, productId, colorId } = cartItem
  const { addToCart, removeFromCart, getCountInCart } = useCartStore()
  const [fetchingCart, setFetchingCart] = useState(false)

  const count = getCountInCart(productId, colorId)

  async function onAddToCart() {
    setFetchingCart(true)
    try {
      await addToCart(product, colorId, authenticated)
    } finally {
      setFetchingCart(false)
    }
  }

  async function onRemoveFromCart() {
    setFetchingCart(true)
    try {
      await removeFromCart(product, colorId, authenticated)
    } finally {
      setFetchingCart(false)
    }
  }

  function CartButton() {
    if (fetchingCart) {
      return (
        <Button disabled>
          <Spinner />
        </Button>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onRemoveFromCart}>
          {count === 1 ? <X className="h-4" /> : <MinusIcon className="h-4" />}
        </Button>
        <Button disabled variant="ghost" size="icon">
          {count}
        </Button>
        <Button variant="outline" size="icon" onClick={onAddToCart}>
          <PlusIcon className="h-4" />
        </Button>
      </div>
    )
  }

  function Price() {
    if (product?.discount > 0) {
      const price = product?.price - (product?.price * product?.discount) / 100
      const percentage = product?.discount
      return (
        <div className="flex gap-2 items-center">
          <Badge className="flex gap-4" variant="destructive">
            <div className="line-through">${product?.price.toFixed(0)}</div>
            <div>{percentage.toFixed(0)}%</div>
          </Badge>
          <h2>{price.toFixed(0)} VNĐ</h2>
        </div>
      )
    }

    return <h2>${product?.price.toFixed(2)}</h2>
  }

  return (
    <Card>
      <CardHeader className="p-0 md:hidden">
        <div className="relative h-32 w-full">
          <Link href={`/products/${product?.id}`}>
            <Image
              className="rounded-t-lg"
              src={product?.images[0]}
              alt="product image"
              fill
              sizes="(min-width: 1000px) 30vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-4 p-3">
        <div className="relative w-full col-span-2 hidden md:inline-flex">
          <Link href={`/products/${product?.id}`}>
            <Image
              className="rounded-lg"
              src={product?.images[0]}
              alt="item image"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
        <div className="col-span-4 block space-y-2">
          <Link href={`/products/${product?.id}`}>
            <h2>{product?.title}</h2>
          </Link>
          <p className="text-xs text-muted-foreground text-justify">
            {product?.description}
          </p>
          <Price />
          <CartButton />
        </div>
      </CardContent>
    </Card>
  )
}
