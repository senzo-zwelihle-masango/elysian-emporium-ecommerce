export interface ShoppingCartItem {
  id: string
  name: string
  price: number
  images: string
  quantity: number
}

export interface ShoppingCartClientProps {
  items: ShoppingCartItem[]
  userId: string
}
