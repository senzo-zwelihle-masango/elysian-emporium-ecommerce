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

interface TagFilterProps {
  initialTag?: string
  tags: string[]
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

export const TagFilter = ({ initialTag, tags }: TagFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTag = initialTag || searchParams.get('tag') || 'all'

  const handleTagChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('tag', value)
    } else {
      params.delete('tag')
    }
    router.push(`?${params.toString()}`)
  }

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    router.push(`?${params.toString()}`)
  }

  const hasActiveFilter = currentTag !== 'all'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="tag-filter"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="space-y-2"
      >
        <Label htmlFor="tag-select" className="block text-sm font-medium">
          Tag
        </Label>
        <div className="flex items-center gap-2">
          <Select onValueChange={handleTagChange} value={currentTag} disabled={tags.length === 0}>
            <SelectTrigger id="tag-select" aria-label="Select a tag to filter by">
              <SelectValue placeholder="Select a tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
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
                  aria-label="Clear tag filter"
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
        {tags.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-1 text-sm text-gray-500"
          >
            No tags available.
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
