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

interface SortFilterProps {
  initialSortBy?: string
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

export const SortFilter = ({ initialSortBy }: SortFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSortBy = searchParams.get('sortBy') || initialSortBy || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'newest') {
      params.set('sortBy', value)
    } else {
      params.delete('sortBy')
    }
    router.push(`?${params.toString()}`)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('sortBy')
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilter = currentSortBy !== 'newest'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="sort-filter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-2"
      >
        <Label htmlFor="sort-select" className="block text-sm font-medium">
          Sort By
        </Label>
        <div className="flex items-center gap-2">
          <Select onValueChange={handleSortChange} value={currentSortBy}>
            <SelectTrigger id="sort-select" aria-label="Select sort order">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
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
                  aria-label="Clear sort filter"
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
      </motion.div>
    </AnimatePresence>
  )
}
