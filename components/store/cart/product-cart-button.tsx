'use client'

import { useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { LoaderIcon, ShoppingBagIcon, SparklesIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

function AddToCartButtonContent({
  stock,
  isSuccess,
  onSuccessComplete,
}: {
  stock: number
  isSuccess: boolean
  onSuccessComplete: () => void
}) {
  const { pending } = useFormStatus()

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onSuccessComplete()
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, onSuccessComplete])

  return (
    <AnimatePresence mode="wait">
      {pending ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <LoaderIcon className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">Adding to Cart...</span>
        </motion.div>
      ) : isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 600 }}
          >
            <SparklesIcon className="h-4 w-4" />
          </motion.div>
          <motion.span
            className="font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Added Successfully!
          </motion.span>
        </motion.div>
      ) : (
        <motion.div
          key="default"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-center gap-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <ShoppingBagIcon className="h-4 w-4" />
          </motion.div>
          <span className="font-medium">{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ProductCartButton = ({
  stock,
  formAction,
  productId,
  disabled = false,
  className,
  children,
}: {
  stock: number
  formAction: (formData: FormData) => Promise<void> | void
  productId: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    try {
      await formAction(formData)
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const isOutOfStock = stock === 0 || disabled
  return (
    <form action={handleSubmit}>
      <Input type="hidden" name="productId" value={productId} />

      <motion.div
        whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
        whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative"
      >
        <Button
          size={'lg'}
          type="submit"
          disabled={isOutOfStock}
          className={cn(
            'relative overflow-hidden transition-all duration-500',

            'hover:from-blue-700 hover:via-purple-600 hover:to-purple-700',
            'hover:shadow-xl hover:shadow-blue-500/25',
            'disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500',
            'disabled:shadow-none',
            'group relative',
            isSuccess && 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
            'w-full',
            className
          )}
        >
          {/* Animated background shimmer */}
          <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={isHovered && !isOutOfStock ? { x: ['-100%', '200%'] } : { x: '-100%' }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
              repeat: isHovered && !isOutOfStock ? Infinity : 0,
              repeatDelay: 1,
            }}
          />

          {/* Success ripple effect */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                className="absolute inset-0 rounded-md"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {children || (
            <AddToCartButtonContent
              stock={stock}
              isSuccess={isSuccess}
              onSuccessComplete={() => setIsSuccess(false)}
            />
          )}
        </Button>
      </motion.div>
    </form>
  )
}

export default ProductCartButton
