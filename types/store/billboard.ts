export interface BillboardCategory {
  id: string
  name: string
}

export interface BillboardFeaturedProduct {
  id: string
  name: string
  price: number
  images: string[]
  brand: {
    name: string
  }
}

export interface Billboard {
  id: string
  label: string
  description: string
  image: string
  featuredProductId: string | null
  featuredProduct: BillboardFeaturedProduct | null
  category: BillboardCategory
}
