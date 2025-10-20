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

interface CategoryFilterProps {
  initialCategory?: string
  categories: string[]
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

export const CategoryFilter = ({ initialCategory, categories }: CategoryFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = initialCategory || searchParams.get('category') || 'all'

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    router.push(`?${params.toString()}`)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilter = currentCategory !== 'all'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="category-filter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-2"
      >
        <Label htmlFor="category-select" className="block text-sm font-medium">
          Category
        </Label>
        <div className="flex items-center gap-2">
          <Select
            onValueChange={handleCategoryChange}
            value={currentCategory}
            disabled={categories.length === 0}
          >
            <SelectTrigger id="category-select" aria-label="Select a category to filter by">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
                  aria-label="Clear category filter"
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
        {categories.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-gray-500"
          >
            No categories available.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
