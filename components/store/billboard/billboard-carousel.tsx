'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, ShoppingBagIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Billboard } from '@/types/store/billboard'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/store/format'

interface BillboardCarouselProps {
  billboards: Billboard[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const BillboardCarousel = ({
  billboards,
  autoPlay = true,
  autoPlayInterval = 8000,
}: BillboardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle auto-play
  useEffect(() => {
    if (!autoPlay || billboards.length <= 1) return

    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prevIndex) => (prevIndex === billboards.length - 1 ? 0 : prevIndex + 1))
    }, autoPlayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, billboards.length])

  // Handle manual navigation
  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? billboards.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === billboards.length - 1 ? 0 : prevIndex + 1))
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Reset interval on user interaction
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (autoPlay && billboards.length > 1) {
      intervalRef.current = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex === billboards.length - 1 ? 0 : prevIndex + 1))
      }, autoPlayInterval)
    }
  }

  if (billboards.length === 0) {
    return (
      <div className="bg-muted flex h-96 w-full items-center justify-center rounded-xl">
        <p className="text-muted-foreground">No billboards available</p>
      </div>
    )
  }

  const currentBillboard = billboards[currentIndex]

  // Slide variants for animation
  const slideVariants = {
    hiddenRight: {
      x: '100%',
      opacity: 0,
    },
    hiddenLeft: {
      x: '-100%',
      opacity: 0,
    },
    visible: {
      x: '0',
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut' as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      {/* Carousel Container */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial={direction > 0 ? 'hiddenRight' : 'hiddenLeft'}
            animate="visible"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentBillboard.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-4 md:px-8">
                <div className="max-w-2xl text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Badge className="mb-4">{currentBillboard.category.name}</Badge>
                  </motion.div>

                  <motion.h1
                    className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {currentBillboard.label}
                  </motion.h1>

                  <motion.p
                    className="mb-8 max-w-lg text-lg text-gray-200 md:text-xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    {currentBillboard.description}
                  </motion.p>

                  {/* Featured Product */}
                  {currentBillboard.featuredProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="mb-8 max-w-md rounded-xl bg-white/10 p-4 backdrop-blur-sm dark:bg-black/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white/60 dark:bg-black/60">
                          {currentBillboard.featuredProduct.images?.[0] ? (
                            <Image
                              src={currentBillboard.featuredProduct.images[0]}
                              alt={currentBillboard.featuredProduct.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-300">
                            {currentBillboard.featuredProduct.brand.name}
                          </p>
                          <p className="font-medium text-white">
                            {currentBillboard.featuredProduct.name}
                          </p>
                          <p className="font-bold text-white">
                            {formatPrice(currentBillboard.featuredProduct.price)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={`/category/${currentBillboard.category.id}`}>
                      <Button
                        size="lg"
                        className="transform transition-all duration-300 hover:scale-105"
                        onClick={resetInterval}
                      >
                        <ShoppingBagIcon />
                        Shop Now
                      </Button>
                    </Link>

                    {currentBillboard.featuredProduct && (
                      <Link href={`/product/${currentBillboard.featuredProduct.id}`}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="transform transition-all duration-300 hover:scale-105"
                          onClick={resetInterval}
                        >
                          <EyeIcon />
                          View Product
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {billboards.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrevious()
              resetInterval()
            }}
            className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => {
              goToNext()
              resetInterval()
            }}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {billboards.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
          {billboards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                goToSlide(index)
                resetInterval()
              }}
              className={cn(
                'h-3 w-3 rounded-full transition-all duration-300',
                index === currentIndex ? 'w-6 bg-white' : 'bg-white/50 hover:bg-white/80'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BillboardCarousel
