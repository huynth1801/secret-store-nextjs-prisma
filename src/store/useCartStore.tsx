import { create } from "zustand"
import axios from "axios"
import { persist } from "zustand/middleware"
// import { Color } from "@prisma/client"

type Product = {
  id: string
  title: string
  price: number
  images: string[]
  description: string
  discount: number
}

export type Color = {
  id: string
  name: string
  value: string
}

// type CartItem = {
//   productId: string
//   product: Product
//   colorId: string // New field to store selected color
//   color: Color // New field for color details
//   count: number
// }

export interface CartItem {
  product: Product
  productId: string
  color: Color
  colorId: string
  count: number
}

type CartState = {
  cart: {
    items: CartItem[]
  }
  loading: boolean
  getReceiptDetails: () => {
    totalAmount: number
    discountAmount: number
    taxAmount: number
    payableAmount: number
  }
  refreshCart: (authenticated: boolean) => Promise<void>
  addToCart: (
    product: Product,
    colorId: Color,
    authenticated: boolean
  ) => Promise<void>
  removeFromCart: (
    product: Product,
    color: Color,
    authenticated: boolean
  ) => Promise<void>
  getCountInCart: (productId: string, colorId: string) => number
  totalItems: () => number
  updateLocalCart: (
    product: Product,
    color: Color,
    delta: number
  ) => CartState["cart"]
  clearCart: () => void // New method to clear the cart
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: { items: [] },
      loading: false,

      refreshCart: async (authenticated: boolean) => {
        set({ loading: true })

        try {
          let cartData

          if (authenticated) {
            const response = await axios.get("/api/cart")
            cartData = response.data
          } else {
            const localCart = localStorage.getItem("cart")
            cartData = localCart ? JSON.parse(localCart) : { items: [] }
          }

          set({ cart: cartData })
        } catch (error) {
          console.error("Failed to refresh cart:", error)
        } finally {
          set({ loading: false })
        }
      },

      addToCart: async (
        product: Product,
        color: Color,
        authenticated: boolean
      ) => {
        set({ loading: true })

        try {
          const count = get().getCountInCart(product.id, color.id)
          let updatedCart

          if (authenticated) {
            const response = await axios.post("/api/cart", {
              productId: product.id,
              colorId: color.id,
              count: count + 1,
            })
            updatedCart = await response.data
          } else {
            updatedCart = get().updateLocalCart(product, color, 1)
          }

          set({ cart: updatedCart })
        } catch (error) {
          console.error("Failed to add to cart:", error)
        } finally {
          set({ loading: false })
        }
      },

      removeFromCart: async (
        product: Product,
        color: Color,
        authenticated: boolean
      ) => {
        set({ loading: true })

        try {
          const count = get().getCountInCart(product.id, color.id)
          let updatedCart

          if (authenticated) {
            const response = await axios.post("/api/cart", {
              productId: product.id,
              colorId: color.id,
              count: count - 1,
            })
            updatedCart = await response.data
          } else {
            updatedCart = get().updateLocalCart(product, color, -1)
          }

          set({ cart: updatedCart })
        } catch (error) {
          console.error("Failed to remove from cart:", error)
        } finally {
          set({ loading: false })
        }
      },

      getCountInCart: (productId: string, colorId: string) => {
        const items = get().cart.items || []
        const item = items.find(
          (item) => item.productId === productId && item.color?.id === colorId
        )
        return item ? item.count : 0
      },

      totalItems: () => {
        const items = get().cart.items
        return items.reduce((total, item) => total + item.count, 0)
      },

      updateLocalCart: (product: Product, color: Color, delta: number) => {
        const { cart } = get()
        const items = [...cart.items]
        const index = items.findIndex(
          (item) => item.productId === product.id && item.color.id === color.id
        )

        if (index > -1) {
          items[index].count += delta
          if (items[index].count <= 0) items.splice(index, 1)
        } else if (delta > 0) {
          items.push({
            productId: product.id,
            product,
            colorId: color.id,
            color,
            count: delta,
          })
        }

        const updatedCart = { ...cart, items }
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        return updatedCart
      },

      clearCart: () => {
        set({ cart: { items: [] } })
        localStorage.removeItem("cart")
      },

      getReceiptDetails: () => {
        const { cart } = get()
        let totalAmount = 0
        let discountAmount = 0

        if (cart.items.length > 0) {
          for (const item of cart.items) {
            totalAmount += item.count * (item.product?.price ?? 0)
            discountAmount += item.count * (item.product?.discount ?? 0)
          }
        }

        const afterDiscountAmount = totalAmount - discountAmount
        const taxAmount = afterDiscountAmount * 0.09
        const payableAmount = afterDiscountAmount + taxAmount
        return {
          totalAmount,
          discountAmount,
          afterDiscountAmount,
          taxAmount,
          payableAmount,
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
)

export default useCartStore
