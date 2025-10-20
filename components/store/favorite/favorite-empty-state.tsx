'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { HeartCrack } from 'lucide-react'

import { Button } from '@/components/ui/button'

const FavoritesEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto mt-10 flex min-h-[400px] max-w-md flex-col items-center justify-center rounded-lg p-8 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full">
        <HeartCrack className="text-coral-red-600 size-40" />
      </div>

      <p className="text-muted-foreground mt-2 mb-8 text-center text-sm leading-6">
        It looks like you havent added any products to your favorites yet. Browse our products and
        add items you love!
      </p>

      <Button asChild size={'lg'} className="transition-transform duration-200 hover:scale-105">
        <Link href="/products">Discover Products</Link>
      </Button>
    </motion.div>
  )
}

export default FavoritesEmptyState
