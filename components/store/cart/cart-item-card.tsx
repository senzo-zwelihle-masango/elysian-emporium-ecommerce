'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { TrashIcon, Loader2, Package } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import { ShoppingCartItem } from '@/interfaces/cart'

interface DeleteItemButtonProps {
  productId: string
  delItemAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

function DeleteItemButton({ productId, delItemAction }: DeleteItemButtonProps) {
  const { pending } = useFormStatus()

  const handleDelete = async (formData: FormData) => {
    const result = await delItemAction(formData)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <form action={handleDelete} className="flex-shrink-0">
      <input type="hidden" name="productId" value={productId} />
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="destructive"
          size="icon"
          type="submit"
          disabled={pending}
          className="h-9 w-9 rounded-full bg-red-500 shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl"
        >
          <AnimatePresence mode="wait">
            {pending ? (
              <motion.div
                key="loading-delete"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <Loader2 className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div
                key="trash-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <TrashIcon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Remove item from cart</span>
        </Button>
      </motion.div>
    </form>
  )
}

interface CartItemCardProps {
  item: ShoppingCartItem
  delItemAction: (formData: FormData) => Promise<{ success: boolean; message: string }>
}

const ShoppingCartItemCard = ({ item, delItemAction }: CartItemCardProps) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatCurrency = (amount: number) => {
    if (!isClient) {
      return `R ${amount.toFixed(2)}`
    }
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring' as const,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: 'easeIn' as const,
      },
    },
    hover: {
      y: -5,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 10,
      },
    },
  }

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      className="group"
    >
      <Card className="overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="flex items-center gap-4 p-6 md:gap-6">
            {/* Product Image */}
            <motion.div
              className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border sm:h-32 sm:w-32"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {item.images ? (
                <Image
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  fill
                  src={item.images}
                  alt={item.name}
                  sizes="(max-width: 768px) 100px, 128px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl border">
                  <Package className="text-muted-foreground h-8 w-8" />
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <div className="flex min-h-[80px] flex-grow flex-col justify-between py-2">
              <div className="space-y-2">
                <motion.h3
                  className="group-hover:text-primary line-clamp-2 text-lg font-bold transition-colors duration-200"
                  layoutId={`title-${item.id}`}
                >
                  {item.name}
                </motion.h3>

                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="px-2 py-1 text-xs">
                    Qty: {item.quantity}
                  </Badge>

                  {item.quantity > 1 && (
                    <span className="text-muted-foreground text-sm">
                      {formatCurrency(item.price)} each
                    </span>
                  )}
                </div>
              </div>

              <motion.div
                className="mt-3 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-right">
                  <p className="text-primary text-2xl font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-muted-foreground text-sm">Total for {item.quantity} items</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Delete Button */}
            <div className="flex flex-col items-center justify-start pt-2">
              <DeleteItemButton productId={item.id} delItemAction={delItemAction} />
            </div>
          </div>

          <motion.div
            className="from-primary/20 via-primary to-primary/20 h-1 bg-gradient-to-r"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ShoppingCartItemCard
