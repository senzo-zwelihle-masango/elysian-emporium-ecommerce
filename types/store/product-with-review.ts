import { Decimal } from '@/lib/generated/prisma/runtime/library'
import { Review, User } from '@/lib/generated/prisma/client'

export type ReviewUserSelect = Pick<User, 'id' | 'name' | 'image'>

export type ReviewServer = Pick<Review, 'id' | 'rating' | 'comment' | 'createdAt'> & {
  user: ReviewUserSelect
}

export type ProductServer = {
  id: string
  name: string
  slug: string
  sku: string
  brand: string
  price: Decimal
  stock: number
  productVariant?: string | null
  productVariantValue?: string | null
  description: string
  category: string
  features: string
  specifications?: string | null
  content?: string | null
  images: string[]
  tag: string
  status: string
  createdAt: Date
  updatedAt: Date
  review: ReviewServer[]
}

export type Product = {
  id: string
  name: string
  slug: string
  sku: string
  brand: string
  price: string
  stock: number
  productVariant?: string | null
  productVariantValue?: string | null
  description: string
  category: string
  features: string
  specifications?: string | null
  content?: string | null
  images: string[]
  tag: string
  status: string
  isFavorited?: boolean
  createdAt: Date
  updatedAt: Date
  reviews: ReviewClient[]
}

export type ReviewClient = Omit<ReviewServer, 'user'> & {
  user: Omit<ReviewUserSelect, 'profileImage'> & { image: string | null }
}

export type ProductStatus =
  | 'Featured'
  | 'Active'
  | 'Inactive'
  | 'Archived'
  | 'Discontinued'
  | 'ComingSoon'
  | 'PreOrder'
  | 'BackInStock'
  | 'LimitedStock'
  | 'OutofStock'
  | string

export function setStockStatus(
  stock: number,
  status: ProductStatus
): {
  label: string
  color: string
  isAvailable: boolean
} {
  const numericStock = typeof stock === 'number' ? stock : Number(stock)

  if (status === 'OutofStock' || numericStock <= 0) {
    return {
      label: 'Out of Stock',
      color: 'bg-red-700',
      isAvailable: false,
    }
  }

  if (status === 'ComingSoon') {
    return {
      label: 'Coming Soon',
      color: 'bg-blue-700',
      isAvailable: false,
    }
  }

  if (status === 'Discontinued') {
    return {
      label: 'Discontinued',
      color: 'bg-gray-700',
      isAvailable: false,
    }
  }

  if (status === 'Inactive') {
    return {
      label: 'Inactive',
      color: 'bg-zinc-700',
      isAvailable: false,
    }
  }

  if (status === 'Archived') {
    return {
      label: 'Archived',
      color: 'bg-yellow-700',
      isAvailable: false,
    }
  }

  if (status === 'PreOrder') {
    return {
      label: 'Pre-Order',
      color: 'bg-violet-700',
      isAvailable: true,
    }
  }

  if (status === 'BackInStock') {
    return {
      label: 'Back in Stock',
      color: 'bg-emerald-700',
      isAvailable: true,
    }
  }

  if (status === 'LimitedStock' || (numericStock > 0 && numericStock <= 5)) {
    return {
      label: `Only ${numericStock} left`,
      color: 'bg-orange-700',
      isAvailable: true,
    }
  }

  if (status === 'Featured') {
    return {
      label: 'Featured',
      color: 'bg-primary',
      isAvailable: true,
    }
  }

  if (status === 'Active') {
    return {
      label: 'In Stock',
      color: 'bg-green-700',
      isAvailable: true,
    }
  }

  if (numericStock > 0) {
    return {
      label: 'In Stock',
      color: 'bg-green-700',
      isAvailable: true,
    }
  }

  return {
    label: 'Out of Stock',
    color: 'bg-red-700',
    isAvailable: false,
  }
}

export type ProductTag =
  | 'New'
  | 'Sale'
  | 'BestSeller'
  | 'Trending'
  | 'Popular'
  | 'LimitedEdition'
  | 'Exclusive'
  | 'Seasonal'
  | 'Clearance'
  | 'BackInStock'
  | 'PreOrder'
  | string

export function setProductTag(tag: ProductTag): {
  label: string
  color: string
} {
  switch (tag) {
    case 'New':
      return { label: 'New', color: 'bg-green-700' }

    case 'Sale':
      return { label: 'Sale', color: 'bg-red-700' }

    case 'BestSeller':
      return { label: 'Best Seller', color: 'bg-yellow-700' }

    case 'Trending':
      return { label: 'Trending', color: 'bg-orange-700' }

    case 'Popular':
      return { label: 'Popular', color: 'bg-blue-700' }

    case 'LimitedEdition':
      return { label: 'Limited Edition', color: 'bg-purple-700' }

    case 'Exclusive':
      return { label: 'Exclusive', color: 'bg-pink-700' }

    case 'Seasonal':
      return { label: 'Seasonal', color: 'bg-teal-700' }

    case 'Clearance':
      return { label: 'Clearance', color: 'bg-rose-700' }

    case 'BackInStock':
      return { label: 'Back in Stock', color: 'bg-emerald-700' }

    case 'PreOrder':
      return { label: 'Pre-Order', color: 'bg-violet-700' }

    default:
      return {
        label: tag,
        color: 'bg-gray-100',
      }
  }
}

// star rating
export function setAverageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, review) => sum + review.rating, 0)
  return total / reviews.length
}

// Helper function to serialize server product for client
export function serializeProduct(product: ProductServer): Product {
  return {
    ...product,
    price: product.price.toString(),
    // Ensure reviews are serialized correctly for the client type
    reviews: (product.review || []).map((r) => ({
      ...r,
      user: {
        ...r.user,
        image: r.user.image,
      },
    })),
  }
}

// Helper function to serialize multiple products
export function serializeProducts(products: ProductServer[]): Product[] {
  return products.map(serializeProduct)
}

// Southa local currency
export function formatPrice(price: string | Decimal) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(numericPrice)
}

// Helper to convert string price back to number for calculations
export function getPriceAsNumber(price: string): number {
  return parseFloat(price)
}

export type ProductFilterParams = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  tag?: string
  brand?: string
}
