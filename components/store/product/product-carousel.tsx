'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface ProductImagesCarouselProps {
  images: string[]
  productName: string
}

const ProductCarousel = ({ images, productName }: ProductImagesCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    skipSnaps: false,
    dragFree: false,
  })
  const [thumbnailRef, thumbnailApi] = useEmblaCarousel({
    dragFree: true,
    align: 'start',
    containScroll: 'keepSnaps',
    breakpoints: {
      '(max-width: 640px)': {
        slidesToScroll: 2,
        axis: 'x',
      },
      '(min-width: 641px)': {
        slidesToScroll: 1,
        axis: 'x',
      },
    },
  })

  const onSelect = useCallback(() => {
    if (!emblaApi || !thumbnailApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(newIndex)
    thumbnailApi.scrollTo(newIndex)
  }, [emblaApi, thumbnailApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !thumbnailApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi, thumbnailApi]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Main Image Carousel */}
      <motion.div
        className="group relative mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden border shadow-lg">
          <div ref={emblaRef}>
            <div className="flex touch-pan-y">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="w-full flex-none"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-square w-full max-w-full">
                    <Image
                      src={image}
                      alt={`${productName} - Image ${index + 1}`}
                      fill
                      className="object-contain p-8 transition-transform duration-300 hover:scale-105"
                      priority={index === 0}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <motion.div
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="h-12 w-12 rounded-full shadow-lg backdrop-blur-sm"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <motion.div
            className="absolute right-4 bottom-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="secondary" className="backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-hidden" ref={thumbnailRef}>
            <div className="mt-2 flex gap-3 px-2 pb-2">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => onThumbClick(index)}
                    className={cn(
                      'relative overflow-hidden p-0 transition-all duration-300 focus:outline-none',
                      'h-16 w-16 sm:h-20 sm:w-20',
                      index === selectedIndex
                        ? 'ring-primary scale-105 shadow-lg ring-2'
                        : 'hover:shadow-md'
                    )}
                    asChild
                  >
                    <motion.button
                      whileHover={{
                        scale: index === selectedIndex ? 1.05 : 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover transition-all duration-300"
                        sizes="80px"
                      />

                      {/* Overlay for non-selected thumbnails */}
                      <AnimatePresence>
                        {index !== selectedIndex && (
                          <motion.div
                            className="bg-background/40 absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Dots Indicator (Mobile Alternative) */}
      {images.length > 1 && (
        <motion.div
          className="mt-4 flex justify-center gap-2 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onThumbClick(index)}
              className={cn(
                'h-2 rounded-full border transition-all duration-300',
                index === selectedIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted hover:bg-muted-foreground/50 w-2'
              )}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default ProductCarousel
