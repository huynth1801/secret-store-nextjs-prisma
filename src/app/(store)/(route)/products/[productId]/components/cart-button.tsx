"use client"

import { Spinner } from "@/components/native/icons"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon, ShoppingBagIcon, X } from "lucide-react"
import { useAuth } from "@/app/hooks/use-auth"
import useCartStore from "@/store/useCartStore"
import { Product } from "@prisma/client"

type CartButtonProps = {
  product: Product
  selectedColor: string
}

export default function CartButton({
  product,
  selectedColor,
}: CartButtonProps) {
  return <ButtonComponent product={product} selectedColor={selectedColor} />
}

type ButtonComponentProps = {
  product: Product
  selectedColor: string
}

const ButtonComponent = ({ product, selectedColor }: ButtonComponentProps) => {
  const { isAuthenticated } = useAuth()
  const { loading, addToCart, getCountInCart, removeFromCart } = useCartStore()

  const count = getCountInCart(product.id, selectedColor)

  if (loading)
    return (
      <Button disabled>
        <Spinner />
      </Button>
    )

  const handleAddToCart = () =>
    addToCart(product, selectedColor, isAuthenticated)
  const handleRemoveFromCart = () =>
    removeFromCart(product, selectedColor, isAuthenticated)

  if (count === 0) {
    return (
      <Button className="flex gap-2" onClick={handleAddToCart}>
        <ShoppingBagIcon className="h-4" />
        Add to cart
      </Button>
    )
  }

  return (
    <>
      <Button variant={"outline"} size={"icon"} onClick={handleRemoveFromCart}>
        {count === 1 ? (
          <X className="h-4 w-4" />
        ) : (
          <MinusIcon className="h-4 w-4" />
        )}
      </Button>
      <Button disabled variant="outline" size="icon">
        {count}
      </Button>
      <Button variant="outline" size="icon" onClick={handleAddToCart}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </>
  )
}
