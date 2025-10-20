'use client'

import React, { useTransition, useEffect } from 'react'
import { HeartIcon, LoaderIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import { addNewFavoriteItemAction } from '@/server/actions/store/favorite'

// Floating hearts animation component
const FloatingHearts = ({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            opacity: 0,
            scale: 0,
            x: '50%',
            y: '50%',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 0.8, 0],
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        >
          <HeartIcon className="h-3 w-3 fill-red-400 text-red-400" />
        </motion.div>
      ))}
    </div>
  )
}

// Ripple effect component
const RippleEffect = ({ show }: { show: boolean }) => {
  if (!show) return null

  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      initial={{
        background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 0%)',
        scale: 0,
      }}
      animate={{
        background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
        scale: 1.5,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  )
}

const FavoriteButton = ({
  productId,
  initialIsFavorited,
  className,
  showFloatingHearts = true,
}: {
  productId: string
  initialIsFavorited: boolean
  className?: string
  showFloatingHearts?: boolean
}) => {
  const [isPending, startTransition] = useTransition()
  const [isFavorited, setIsFavorited] = React.useState(initialIsFavorited)
  const [showAnimation, setShowAnimation] = React.useState(false)
  const [showRipple, setShowRipple] = React.useState(false)

  // Sync with prop changes (e.g., when page refreshes)
  useEffect(() => {
    setIsFavorited(initialIsFavorited)
  }, [initialIsFavorited])

  const handleToggleFavoriteAction = async () => {
    const previousIsFavorited = isFavorited
    const newFavoritedState = !isFavorited

    // Optimistic UI update
    setIsFavorited(newFavoritedState)

    // Trigger animations for favoriting
    if (newFavoritedState) {
      setShowAnimation(true)
      setShowRipple(true)

      // Reset animation states
      setTimeout(() => {
        setShowAnimation(false)
        setShowRipple(false)
      }, 1500)
    }

    startTransition(async () => {
      try {
        const result = await addNewFavoriteItemAction(productId)

        if (result.success) {
          toast.info(result.message)

          // Always sync with server state
          if (result.isFavorited !== undefined) {
            setIsFavorited(result.isFavorited)
          }
        } else {
          toast.error(result.message)
          setIsFavorited(previousIsFavorited) // Revert on failure
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
        toast.error('An unexpected error occurred.')
        setIsFavorited(previousIsFavorited) // Revert on error
      }
    })
  }
  return (
    <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        size={'lg'}
        onClick={handleToggleFavoriteAction}
        disabled={isPending}
        className={cn(
          'group relative overflow-hidden transition-all duration-300',
          'border-2',
          // Base styles
          isFavorited
            ? 'border-red-500 bg-red-50 text-red-500 shadow-lg shadow-red-500/25'
            : 'border-gray-300 text-gray-500 hover:border-red-400 hover:bg-red-50 hover:text-red-500 hover:shadow-md',
          // Dark mode styles
          'dark:border-gray-700 dark:text-gray-400',
          'dark:hover:border-red-400 dark:hover:bg-red-950 dark:hover:text-red-400',
          isFavorited && 'dark:border-red-500 dark:bg-red-950 dark:text-red-400',
          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-60',
          className
        )}
      >
        {/* Background gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0"
          animate={{
            opacity: isFavorited && !isPending ? 0.1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Ripple effect */}
        <AnimatePresence>{showRipple && <RippleEffect show={showRipple} />}</AnimatePresence>

        {/* Floating hearts */}
        {showFloatingHearts && <FloatingHearts show={showAnimation} />}

        {/* Main content */}
        <AnimatePresence mode="wait" initial={false}>
          {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <LoaderIcon className={cn('text-red-500')} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="heart"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                animate={
                  isFavorited
                    ? {
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, -5, 0],
                      }
                    : { scale: 1, rotate: 0 }
                }
                transition={{
                  duration: isFavorited ? 0.6 : 0.2,
                  ease: 'easeInOut',
                }}
              >
                <HeartIcon
                  className={cn(
                    'transition-all duration-300',
                    // Fill states
                    isFavorited ? 'fill-current' : 'fill-none',
                    // Hover animations
                    'group-hover:drop-shadow-sm',
                    // Pulse effect when favorited
                    isFavorited && 'animate-pulse'
                  )}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {isFavorited ? 'Remove ' : 'Favorite'}
        <span className="sr-only">
          {isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        </span>
      </Button>

      {/* Particle burst effect */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 h-1 w-1 rounded-full bg-red-400"
                initial={{
                  scale: 0,
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${-50 + Math.cos((i * Math.PI * 2) / 8) * 40}%`,
                  y: `${-50 + Math.sin((i * Math.PI * 2) / 8) * 40}%`,
                }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FavoriteButton
