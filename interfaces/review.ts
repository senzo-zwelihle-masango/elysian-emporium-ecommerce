export interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment: string
    createdAt: Date
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }
  index?: number
}

interface ReviewWithUser {
  id: string
  rating: number
  comment: string
  createdAt: Date
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export interface ReviewListProps {
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
}
