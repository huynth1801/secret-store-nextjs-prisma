"use client"

import { useState } from "react"
import { Separator } from "@/components/native/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import type { ProductWithIncludes } from "@/types/prisma"
import Link from "next/link"
import useCartStore from "@/store/useCartStore"
import { useAuth } from "@/app/hooks/use-auth"

export const DataSection = ({ product }: { product: ProductWithIncludes }) => {
  const [selectedColor, setSelectedColor] = useState<{
    id: string
    name: string
    value: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Get cart methods from store
  const { addToCart, getCountInCart } = useCartStore()

  function Price() {
    if (product?.discount > 0) {
      const price = product?.price - product?.discount
      const discountPercentage = Math.round(
        (product?.discount / product?.price) * 100
      )
      return (
        <div className="flex gap-2 items-center">
          <Badge className="flex gap-4" variant="destructive">
            <div className="line-through">
              {product?.price.toLocaleString()} VNĐ
            </div>
            <div>{discountPercentage}%</div>
          </Badge>
          <h2 className="">{price.toLocaleString()} VNĐ</h2>
        </div>
      )
    }

    return <h2>{product?.price.toLocaleString()} VNĐ</h2>
  }

  const handleSelectColor = (color: typeof selectedColor) => {
    console.log(color)
    setSelectedColor(color)
  }

  const handleAddToCart = async () => {
    if (!selectedColor) {
      toast.error("You must select a color before adding to cart")
      return
    }

    setIsLoading(true)
    try {
      await addToCart(product, selectedColor, isAuthenticated)

      toast.success(`${product.title} - ${selectedColor.name} added to cart`)
    } catch (error) {
      toast.error("Failed to add item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const itemCount = selectedColor
    ? getCountInCart(product.id, selectedColor.id)
    : 0

  return (
    <div className="col-span-2 w-full rounded-lg bg-neutral-100 p-6 dark:bg-neutral-900">
      <h3 className="mb-4 text-xl font-medium">{product.title}</h3>
      <Separator />

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
        <div className="flex gap-2">
          {product.colors.map((color) => (
            <div
              key={color.id}
              className={`relative group cursor-pointer p-1 rounded-full
                ${selectedColor?.id === color.id ? "ring-2 ring-blue-500" : ""}
              `}
              onClick={() => handleSelectColor(color)}
            >
              <div
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: color.value }}
              />
              <span
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                bg-black text-white text-xs px-2 py-1 rounded opacity-0 
                group-hover:opacity-100 transition-opacity whitespace-nowrap"
              >
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <small className="block my-4">{product.description}</small>
      <Separator />

      <div className="block space-y-4">
        <Price />
        <div className="flex items-center gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedColor}
            className="w-full"
          >
            {isLoading
              ? "Adding..."
              : itemCount > 0
              ? `Add Another (${itemCount} in cart)`
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  )
}
