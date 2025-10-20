'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface BrandFilterProps {
  initialBrand?: string
  brands: string[]
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

export const BrandFilter = ({ initialBrand, brands }: BrandFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentBrand = initialBrand || searchParams.get('brand') || 'all'

  const handleBrandChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('brand', value)
    } else {
      params.delete('brand')
    }
    router.push(`?${params.toString()}`)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('brand')
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilter = currentBrand !== 'all'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="brand-filter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-2"
      >
        <Label htmlFor="brand-select" className="block text-sm font-medium">
          Brand
        </Label>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={handleBrandChange}
            value={currentBrand}
            disabled={brands.length === 0}
          >
            <SelectTrigger id="brand-select" aria-label="Select a brand to filter by">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  size="icon"
                  onClick={handleClearFilter}
                  aria-label="Clear brand filter"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {brands.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-gray-500"
          >
            No brands available.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
