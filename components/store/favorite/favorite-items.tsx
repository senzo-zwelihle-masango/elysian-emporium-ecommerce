'use client'

import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

//  type for a favorite item
interface FavoriteItem {
  id: string
  productId: string
  name: string
  images: string
  price: number
  slug: string
}

interface DeleteFavoriteButtonProps {
  favoriteId: string
  deleteFavoriteAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

function DeleteFavoriteButton({ favoriteId, deleteFavoriteAction }: DeleteFavoriteButtonProps) {
  const { pending } = useFormStatus()

  const handleDelete = async (formData: FormData) => {
    const result = await deleteFavoriteAction(formData)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="favoriteId" value={favoriteId} />
      <Button
        variant="destructive"
        size="icon"
        type="submit"
        disabled={pending}
        className="h-7 w-7 transition-all duration-200 hover:scale-105"
      >
        <AnimatePresence mode="wait">
          {pending ? (
            <motion.span
              key="loading-delete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"
            ></motion.span>
          ) : (
            <motion.span
              key="trash-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Trash2 className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="sr-only">Remove item from favorites</span>
      </Button>
    </form>
  )
}

interface FavoriteItemCardProps {
  item: FavoriteItem
  deleteFavoriteAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

export function FavoriteItemCard({ item, deleteFavoriteAction }: FavoriteItemCardProps) {
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  }

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md md:gap-6"
    >
      <Link href={`/product/${item.id}`} className="flex-shrink-0">
        <div className="relative h-24 w-24 rounded-md sm:h-32 sm:w-32">
          <Image
            className="rounded-md object-cover"
            fill
            src={item.images}
            alt={item.name}
            sizes="(max-width: 768px) 100px, 128px"
          />
        </div>
      </Link>

      <div className="flex flex-grow flex-col justify-between py-1">
        <Link href={`/product/${item.id}`} className="block">
          <h3 className="hover:text-primary mb-1 text-base font-semibold transition-colors duration-200 md:text-lg">
            {item.name}
          </h3>
        </Link>
        <p className="text-primary text-lg font-bold">{/* {formatPrice(item.price)} */}</p>
      </div>

      <DeleteFavoriteButton favoriteId={item.id} deleteFavoriteAction={deleteFavoriteAction} />
    </motion.div>
  )
}
