'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBagIcon, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ShoppingCartItemCard from './cart-item-card'

import { ShoppingCartItem } from '@/interfaces/cart'

import { deleteItemFromCartAction } from '@/server/actions/store/cart'

interface CartItemsListProps {
  items: ShoppingCartItem[]
  showCheckout?: boolean
}

const ShoppingCartItemList = ({ items }: CartItemsListProps) => {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  }

  if (items.length === 0) {
    return (
      <motion.div variants={emptyStateVariants} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden border-2 border-dashed py-16 text-center">
          {/* Background decoration */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)',
                'radial-gradient(circle at 40% 50%, #06b6d4 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />

          <CardContent className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <ShoppingBagIcon className="text-muted-foreground mx-auto mb-6 h-20 w-20" />
            </motion.div>

            <motion.h3
              className="mb-3 text-2xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your cart is waiting for treasures
            </motion.h3>

            <motion.p
              className="text-muted-foreground mb-8 max-w-md text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover amazing products and fill your cart with items youll love!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => router.push('/products')}
                size="lg"
                className="px-8 py-3 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Cart Items Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between border-b pb-4"
      >
        <h2 className="text-muted-foreground text-lg font-semibold">Your Items</h2>
        <motion.div
          animate={{
            rotate: [0, 0, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Sparkles />
        </motion.div>
      </motion.div>

      {/* Cart Items */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ShoppingCartItemCard item={item} delItemAction={deleteItemFromCartAction} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Items count summary */}
      <motion.div
        className="flex items-center justify-center pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-full border px-6 py-3">
          <p className="text-sm font-medium">
            <span className="text-primary font-bold">{items.length}</span>
            {items.length === 1 ? ' item' : ' items'} in your cart
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ShoppingCartItemList
