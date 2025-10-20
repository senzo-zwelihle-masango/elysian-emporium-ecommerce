'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface PriceFilterProps {
  initialMinPrice?: number
  initialMaxPrice?: number
  maxAllowedPrice: number
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 10,
    },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
}

export const PriceFilter = ({
  initialMinPrice = 0,
  initialMaxPrice = 200000,
  maxAllowedPrice,
}: PriceFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentMinPrice = parseFloat(searchParams.get('minPrice') || `${initialMinPrice}`)
  const currentMaxPrice = parseFloat(searchParams.get('maxPrice') || `${initialMaxPrice}`)
  const [range, setRange] = useState<[number, number]>([currentMinPrice, currentMaxPrice])

  useEffect(() => {
    const urlMin = parseFloat(searchParams.get('minPrice') || `${initialMinPrice}`)
    const urlMax = parseFloat(searchParams.get('maxPrice') || `${initialMaxPrice}`)
    setRange([urlMin, urlMax])
  }, [initialMinPrice, initialMaxPrice, searchParams])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleApplyPriceFilter = (newRange: number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    const [min, max] = newRange

    if (min !== initialMinPrice || searchParams.has('minPrice')) {
      params.set('minPrice', min.toString())
    } else {
      params.delete('minPrice')
    }

    if (max !== maxAllowedPrice || searchParams.has('maxPrice')) {
      params.set('maxPrice', max.toString())
    } else {
      params.delete('maxPrice')
    }

    router.push(`?${params.toString()}`)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('minPrice')
    params.delete('maxPrice')
    router.push(`?${params.toString()}`)
    setRange([initialMinPrice, maxAllowedPrice])
  }

  const hasActiveFilter =
    range[0] !== initialMinPrice ||
    range[1] !== maxAllowedPrice ||
    searchParams.has('minPrice') ||
    searchParams.has('maxPrice')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="price-filter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-4"
      >
        <Label htmlFor="price-range" className="block text-sm font-medium">
          Price Range
        </Label>
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>{formatCurrency(range[0])}</span>
          <span>{formatCurrency(range[1])}</span>
        </div>
        <Slider
          min={initialMinPrice}
          max={maxAllowedPrice}
          step={100}
          value={range}
          onValueChange={(value) => {
            if (Array.isArray(value) && value.length === 2) {
              setRange([value[0], value[1]])
            }
          }}
          onValueCommit={handleApplyPriceFilter}
          className="w-full"
        />
        <div className="flex justify-end">
          <AnimatePresence>
            {hasActiveFilter && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilter}
                  aria-label="Clear price filter"
                >
                  Clear
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
