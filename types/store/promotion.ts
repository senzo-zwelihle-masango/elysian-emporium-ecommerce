export interface PromotionBrand {
  id: string
  name: string
}

export interface Promotion {
  id: string
  label: string
  description: string
  image: string
  active: boolean
  brand: PromotionBrand
}
