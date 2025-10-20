'use client'

import { AnimatePresence } from 'motion/react'

import { FavoriteItemCard } from './favorite-items'

import { deleteFavoriteAction } from '@/server/actions/store/favorite'

//  type for a favorite item
interface FavoriteItem {
  id: string
  productId: string
  name: string
  images: string
  price: number
  slug: string
}

interface FavoritesListProps {
  items: FavoriteItem[]
}

export function FavoritesList({ items }: FavoritesListProps) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <FavoriteItemCard key={item.id} item={item} deleteFavoriteAction={deleteFavoriteAction} />
      ))}
    </AnimatePresence>
  )
}
