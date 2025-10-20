'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { SearchFilter } from './search-filter'
import { CategoryFilter } from './category-filter'
import { PriceFilter } from './price-filter'
import { BrandFilter } from './brand-filter'
import { TagFilter } from './tag-filter'
import { SortFilter } from './sort-filter'

interface ProductFilterSidebarProps {
  resolvedSearchParams: { [key: string]: string | string[] | undefined }
  availableCategories: string[]
  availableBrands: string[]
  availableTags: string[]
  maxAllowedPrice: number
}

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: '0%',
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      when: 'afterChildren',
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
}

export const ProductFilterSidebar = ({
  resolvedSearchParams,
  availableCategories,
  availableBrands,
  availableTags,
  maxAllowedPrice,
}: ProductFilterSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobileBreakpoint = 768
      setIsMobile(window.innerWidth < mobileBreakpoint)

      if (window.innerWidth >= mobileBreakpoint) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const parsedMinPrice = resolvedSearchParams.minPrice
    ? parseFloat(resolvedSearchParams.minPrice as string)
    : undefined
  const parsedMaxPrice = resolvedSearchParams.maxPrice
    ? parseFloat(resolvedSearchParams.maxPrice as string)
    : undefined

  return (
    <>
      {isMobile && (
        <div className="mb-4">
          <Button onClick={() => setIsOpen(!isOpen)} className="w-full">
            {isOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      )}

      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            className="space-y-6 rounded-lg border p-4 shadow-sm md:block md:w-1/4"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="border-b pb-2 text-xl font-semibold">Filters</h2>
            <SearchFilter initialSearch={resolvedSearchParams.search as string | undefined} />
            <CategoryFilter
              initialCategory={resolvedSearchParams.category as string | undefined}
              categories={availableCategories}
            />
            <PriceFilter
              initialMinPrice={parsedMinPrice}
              initialMaxPrice={parsedMaxPrice}
              maxAllowedPrice={maxAllowedPrice}
            />
            <BrandFilter
              initialBrand={resolvedSearchParams.brand as string | undefined}
              brands={availableBrands}
            />
            <TagFilter
              initialTag={resolvedSearchParams.tag as string | undefined}
              tags={availableTags}
            />
            <SortFilter initialSortBy={resolvedSearchParams.sortBy as string | undefined} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
