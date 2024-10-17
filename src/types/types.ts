export interface CartItem {
  id: string
  name: string
  count: number
}

export interface CartState {
  items: CartItem[]
}
