import useCartStore from "@/store/useCartStore"
import { useMemo } from "react"
import { ReceiptCalculation } from "./receipt"

export const useReceiptCalculations = () => {
  const { cart } = useCartStore()

  return useMemo((): ReceiptCalculation => {
    let totalAmount = 0
    let discountAmount = 0

    if (cart?.items?.length > 0) {
      for (const item of cart.items) {
        totalAmount += item.count * (item.product?.price ?? 0)
        discountAmount +=
          (item.product.price * (item.product?.discount ?? 0)) / 100
      }
    }

    const afterDiscountAmount = totalAmount - discountAmount
    const taxAmount = afterDiscountAmount * 0.09
    const payableAmount = afterDiscountAmount + taxAmount

    return {
      totalAmount: totalAmount.toFixed(0),
      discountAmount: discountAmount.toFixed(0),
      afterDiscountAmount: afterDiscountAmount.toFixed(0),
      taxAmount: taxAmount.toFixed(0),
      payableAmount: payableAmount.toFixed(0),
    }
  }, [cart.items])
}
