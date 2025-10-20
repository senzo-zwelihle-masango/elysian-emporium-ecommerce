'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShoppingBagIcon, Gift, SparklesIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import { formatPrice } from '@/utils/store/format'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ShoppingCartItemList from './cart-item-list'

import { productContainerVariants } from '@/utils/animation/motion'

import { ShoppingCartClientProps } from '@/interfaces/cart'

const CartClient = ({ items = [] }: ShoppingCartClientProps) => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Free shipping over R500
  const shippingCost = subtotal > 500 ? 0 : 99
  const totalAmount = subtotal + shippingCost

  const handleProceedToCheckout = () => {
    router.push('/check-out')
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        className="container mx-auto py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-dashed py-16 text-center">
          <CardContent className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <ShoppingBagIcon className="mx-auto mb-6 h-20 w-20 text-gray-400" />
            </motion.div>
            <motion.h3
              className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your cart is empty
            </motion.h3>
            <motion.p
              className="mb-8 text-lg text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover amazing products and start shopping!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={() => router.push('/products')} size="lg">
                Start Shopping
                <ArrowRight />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="container mx-auto py-8"
      variants={productContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <motion.div className="space-y-6 lg:col-span-2" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <ShoppingCartItemList items={items} />
        </motion.div>

        {/* Order Summary */}
        <motion.div className="lg:col-span-1" variants={itemVariants}>
          <Card className="sticky top-4 shadow-lg">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Gift />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <span className="">Subtotal</span>
                  <span className="text-lg font-semibold">
                    {isClient ? formatPrice(subtotal) : '---'}
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="flex items-center gap-2">
                    <span>Shipping</span>
                  </div>
                  <span className="font-semibold">
                    {isClient ? (
                      shippingCost === 0 ? (
                        <Badge className="bg-green-600">Free</Badge>
                      ) : (
                        formatPrice(shippingCost)
                      )
                    ) : (
                      '---'
                    )}
                  </span>
                </motion.div>

                <AnimatePresence>
                  {subtotal < 500 && shippingCost > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-center text-sm">
                        Add {isClient ? formatPrice(500 - subtotal) : '---'} more for free shipping!
                        <SparklesIcon />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator className="my-4" />

              <motion.div
                className="flex items-center justify-between rounded-lg border p-4 text-xl font-bold"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <span>Total</span>
                <span>{isClient ? formatPrice(totalAmount) : '---'}</span>
              </motion.div>

              <div className="flex space-y-3 space-x-4 pt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size={'lg'}
                    className="font-semibold shadow-lg hover:shadow-xl"
                    onClick={handleProceedToCheckout}
                  >
                    Checkout
                    <SparklesIcon />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size={'lg'}
                    variant={'outline'}
                    className="font-semibold shadow-lg hover:shadow-xl"
                  >
                    Continue shopping
                    <ShoppingBagIcon />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CartClient
