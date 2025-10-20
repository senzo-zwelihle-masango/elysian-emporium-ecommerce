import { motion } from 'motion/react'

import { Skeleton } from '@/components/ui/skeleton'

import { productContainerVariants } from '@/utils/animation/motion'

export function StoreProductContainerSkeleton({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={productContainerVariants}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Header Skeleton */}
          {(title || subtitle) && (
            <div className="space-y-4 text-center">
              {title && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Skeleton className="mx-auto h-16 w-96 rounded-2xl" />
                </motion.div>
              )}
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Skeleton className="mx-auto h-6 w-[600px] rounded-xl" />
                </motion.div>
              )}
            </div>
          )}

          {/* Toolbar Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border p-6 shadow-sm"
          >
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
                  {/* Image Skeleton */}
                  <div className="aspect-[4/5]">
                    <Skeleton className="h-full w-full" />
                  </div>

                  {/* Content Skeleton */}
                  <div className="flex flex-1 flex-col space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-4 w-4 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>

                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="mt-auto space-y-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 flex-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function StoreProductCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="overflow-hidden rounded-3xl border shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Image Skeleton */}
          <div className="aspect-[4/3] w-full md:aspect-square md:w-80">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 space-y-6 p-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-4 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-[4/5]">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-auto space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function StoreProductGridSkeleton({
  count = 8,
  viewMode,
}: {
  count?: number
  viewMode: 'grid' | 'list'
}) {
  return (
    <div
      className={`grid gap-8 ${
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}
    >
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={`skeleton-${index}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
        >
          <StoreProductCardSkeleton viewMode={viewMode} />
        </motion.div>
      ))}
    </div>
  )
}
