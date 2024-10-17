import { create } from "zustand"
import axios from "axios"
import { persist } from "zustand/middleware"

type Product = {
  id: string
  title: string
  price: number
  images: string[]
  description: string
  discount?: number
}

type CartItem = {
  productId: string
  product: Product
  count: number
}

type CartState = {
  cart: {
    items: CartItem[]
  }
  loading: boolean
  refreshCart: (authenticated: boolean) => Promise<void>
  addToCart: (product: Product, authenticated: boolean) => Promise<void>
  removeFromCart: (product: Product, authenticated: boolean) => Promise<void>
  getCountInCart: (productId: string) => number
  totalItems: () => number
  updateLocalCart: (product: Product, delta: number) => CartState["cart"]
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

      addToCart: async (product: Product, authenticated: boolean) => {
        set({ loading: true })

        try {
          const count = get().getCountInCart(product.id)
          let updatedCart

          if (authenticated) {
            const response = await axios.post("/api/cart", {
              productId: product.id,
              count: count + 1,
            })
            updatedCart = await response.data
          } else {
            updatedCart = get().updateLocalCart(product, 1)
          }

          set({ cart: updatedCart })
        } catch (error) {
          console.error("Failed to add to cart:", error)
        } finally {
          set({ loading: false })
        }
      },

      removeFromCart: async (product: Product, authenticated: boolean) => {
        set({ loading: true })

        try {
          const count = get().getCountInCart(product.id)
          let updatedCart

          if (authenticated) {
            const response = await axios.post("/api/cart", {
              productId: product.id,
              count: count - 1,
            })
            updatedCart = await response.data
          } else {
            updatedCart = get().updateLocalCart(product, -1)
          }

          set({ cart: updatedCart })
        } catch (error) {
          console.error("Failed to remove from cart:", error)
        } finally {
          set({ loading: false })
        }
      },

      getCountInCart: (productId: string) => {
        const items = get().cart.items || []
        const item = items.find((item) => item.productId === productId)
        return item ? item.count : 0
      },

      totalItems: () => {
        const items = get().cart.items
        return items.reduce((total, item) => total + item.count, 0)
      },

      updateLocalCart: (product: Product, delta: number) => {
        const { cart } = get()
        const items = [...cart.items]
        const index = items.findIndex((item) => item.productId === product.id)

        if (index > -1) {
          items[index].count += delta
          if (items[index].count <= 0) items.splice(index, 1)
        } else if (delta > 0) {
          items.push({ productId: product.id, product, count: delta })
        }

        const updatedCart = { ...cart, items }
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        return updatedCart
      },

      clearCart: () => {
        set({ cart: { items: [] } })
        localStorage.removeItem("cart")
      },
    }),
    {
      name: "cart-storage",
    }
  )
)

export default useCartStore
