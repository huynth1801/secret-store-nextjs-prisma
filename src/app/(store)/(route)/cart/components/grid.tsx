"use client"

import { Card, CardContent } from "@/components/ui/card"
import { isVariableValid } from "@/lib/utils"
import { Skeleton } from "./skeleton"
import useCartStore from "@/store/useCartStore"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Item } from "./items"
import { useAuth } from "@/app/hooks/use-auth"
import { Receipt } from "./receipt"
import { CheckoutForm } from "./checkout"

export const CartGrid = () => {
  const { cart, loading, refreshCart } = useCartStore()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    refreshCart(isAuthenticated) // Call refreshCart only once when the component mounts
  }, [])

  const items = cart.items

  // Render empty cart message if no items exist
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

  // Render the cart items and receipt section
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Cart Items */}
      <div className="md:col-span-8 lg:col-span-9">
        {items.map((cartItem, index: number) => (
          <Item
            cartItem={cartItem}
            authenticated={isAuthenticated}
            key={index}
          />
        ))}
      </div>

      {/* Receipt Section */}
      <div className="md:col-span-4 lg:col-span-3">
        <Receipt />
        {/* Checkout form */}
        <CheckoutForm />
      </div>
    </div>
  )
}
