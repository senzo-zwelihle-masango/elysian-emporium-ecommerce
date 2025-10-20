'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Star, TrendingUp, Users, Award, Filter } from 'lucide-react'
import { ReviewCard } from './review-card'
import { ReviewListProps } from '@/interfaces/review'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

export function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((review) => review.rating === rating).length / totalReviews) * 100
        : 0,
  }))

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  if (reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="border-border/50 from-card/80 to-card/60 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-10 text-center shadow-xl backdrop-blur-sm"
      >
        {/* Background decoration */}
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="relative z-10"
        >
          <div className="from-primary/20 to-secondary/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
            <Star className="text-primary h-10 w-10" />
          </div>
          <h3 className="text-foreground mb-3 text-2xl font-bold">No reviews yet</h3>
          <p className="text-muted-foreground mx-auto max-w-md text-lg">
            Be the first to share your experience and help others make informed decisions!
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Ratings Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-border/50 from-card/80 to-card/60 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-xl backdrop-blur-sm"
      >
        {/* Background decoration */}
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

        <div className="relative z-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Left side - Overall rating */}
            <div className="text-center lg:text-left">
              <motion.h2
                className="text-foreground mb-4 text-3xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Customer Reviews
              </motion.h2>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
                    {averageRating.toFixed(1)}
                  </span>
                  <div className="flex flex-col items-start">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.4 + i * 0.1,
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              i < Math.round(averageRating)
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1 font-medium">
                      Based on {totalReviews} review
                      {totalReviews !== 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right side - Rating distribution */}
            <motion.div
              className="max-w-md flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">
                Rating Distribution
              </h3> */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }, index) => (
                  <motion.div
                    key={rating}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex w-16 items-center gap-1">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    </div>
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <motion.div
                        className="from-primary to-secondary h-full rounded-full bg-gradient-to-r"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                          delay: 0.8 + index * 0.1,
                          duration: 0.8,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-8 text-sm">{count}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats cards */}
          <div className="border-border/30 mt-8 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                label: 'Satisfaction',
                value: `${Math.round(averageRating * 20)}%`,
              },
              {
                icon: Users,
                label: 'Total Reviews',
                value: totalReviews.toString(),
              },
              {
                icon: Award,
                label: 'Recommended',
                value: `${Math.round(
                  (reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100
                )}%`,
              },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={label}
                className="from-muted/50 to-muted/30 rounded-2xl bg-gradient-to-br p-4 text-center backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Icon className="text-primary mx-auto mb-2 h-6 w-6" />
                <p className="text-foreground text-2xl font-bold">{value}</p>
                <p className="text-muted-foreground text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <Separator className="my-8" />

      {/* Reviews Section Header with Controls */}
      <motion.div
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-foreground text-2xl font-bold">All Reviews ({totalReviews})</h3>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border-border bg-card text-foreground focus:ring-primary/50 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </motion.div>

      {/* Reviews Grid */}
      <motion.div
        layout
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="popLayout">
          {sortedReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button (if needed) */}
      {reviews.length >= 10 && (
        <motion.div
          className="pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Button variant="outline" size="lg" className="min-w-[200px] gap-2">
              Load More Reviews
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
