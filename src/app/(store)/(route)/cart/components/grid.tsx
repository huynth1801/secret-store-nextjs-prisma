import { Card, CardContent } from "@/components/ui/card"
import { isVariableValid } from "@/lib/utils"
import useCartStore from "@/store/useCartStore"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/hooks/use-auth"
import { Receipt } from "./receipt"
import { CheckoutForm } from "./checkout"
import { Item } from "./items"
import { CartItem } from "@/store/useCartStore"

export const CartGrid = () => {
  const { cart, loading, refreshCart } = useCartStore()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    refreshCart(isAuthenticated)
  }, [isAuthenticated, refreshCart])

  const items: CartItem[] = cart.items

  if (isVariableValid(items) && items.length === 0 && !loading) {
    return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 lg:col-span-9">
          <Card>
            <CardContent className="p-4">
              <Badge variant="outline" className="bg-red-500">
                Your cart is empty...
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-8 lg:col-span-9">
        {items.map((cartItem) => (
          <Item
            cartItem={cartItem}
            authenticated={isAuthenticated}
            key={`${cartItem.productId}}`}
          />
        ))}
      </div>

      <div className="md:col-span-4 lg:col-span-3">
        <Receipt />
        <CheckoutForm />
      </div>
    </div>
  )
}
