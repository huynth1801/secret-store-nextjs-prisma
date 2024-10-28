"use client"

import { Separator } from "@/components/native/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import useCartStore from "@/store/useCartStore"
import { useReceiptCalculations } from "./use-receipt-calculation"

type Product = {
  id: string
  title: string
  price: number
  discount?: number
  images: string[]
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CartItem = {
  productId: string
  product: Product
  count: number
}

export type ReceiptCalculation = {
  totalAmount: string
  discountAmount: string
  afterDiscountAmount: string
  taxAmount: string
  payableAmount: string
}

export function Receipt() {
  const { cart, loading } = useCartStore()

  const calculations = useReceiptCalculations()

  const isCartEmpty = !cart?.items || cart.items.length === 0

  return (
    <Card className={loading ? "animate-pulse" : ""}>
      <CardHeader className="p-4 pb-0">
        <h2 className="font-bold tracking-tight">Receipt</h2>
      </CardHeader>

      {!isCartEmpty ? (
        <CardContent className="p-4 text-sm">
          <div className="block space-y-[1vh]">
            <div className="flex justify-between">
              <p>Total Amount</p>
              <h3>{calculations.totalAmount} VNĐ</h3>
            </div>

            <div className="flex justify-between">
              <p>Discount Amount</p>
              <h3>{calculations.discountAmount} VNĐ</h3>
            </div>

            <div className="flex justify-between">
              <p>Tax Amount</p>
              <h3>{calculations.taxAmount} VNĐ</h3>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between">
            <p>Payable Amount</p>
            <h3>{calculations.payableAmount} VNĐ</h3>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <div>You dont have receipt yet.</div>
        </CardContent>
      )}

      {/* 
      <Separator /> */}

      {/* <CardFooter>
        <Link
          href={isAuthenticated ? "/checkout" : "/sign-in"}
          className="w-full"
        >
          <Button disabled={isCartEmpty} className="w-full">
            Checkout
          </Button>
        </Link>
      </CardFooter> */}
    </Card>
  )
}
