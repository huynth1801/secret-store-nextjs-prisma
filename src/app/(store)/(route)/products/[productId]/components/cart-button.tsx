"use client"

import { Spinner } from "@/components/native/icons"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon, ShoppingBagIcon, X } from "lucide-react"
import { useAuth } from "@/app/hooks/use-auth"
import useCartStore from "@/store/useCartStore"
import { Product } from "@prisma/client"

// type Product = {
//   id: string
//   title: string
//   price: number
// }

type CartButtonProps = {
  product: Product
}

export default function CartButton({ product }: CartButtonProps) {
  return <ButtonComponent product={product} />
}

const ButtonComponent = ({ product }) => {
  const { isAuthenticated } = useAuth()
  const { loading, addToCart, getCountInCart, removeFromCart } = useCartStore()

  const count = getCountInCart(product.id)

  if (loading)
    return (
      <Button disabled>
        <Spinner />
      </Button>
    )

  const handleAddToCart = () => addToCart(product, isAuthenticated)
  const handleRemoveFromCart = () => removeFromCart(product, isAuthenticated)

  if (count === 0) {
    return (
      <Button className="flex gap-2" onClick={handleAddToCart}>
        <ShoppingBagIcon className="h-4" />
        Add to cart
      </Button>
    )
  }

  if (count > 0) {
    return (
      <>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRemoveFromCart}
        >
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
  return null
}
