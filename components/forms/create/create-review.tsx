'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Star, Edit, CheckCircle } from 'lucide-react'
import * as z from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { reviewSchema } from '@/schemas/store/review'

import { createNewReviewAction } from '@/server/actions/store/review'

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  userId: string
  existingRating?: number | null
  existingComment?: string | null
}

const CreateReviewForm = ({ productId, existingRating, existingComment }: ReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingRating || 0,
      comment: existingComment || '',
    },
    mode: 'onChange',
  })

  const currentRating = form.watch('rating')
  const currentComment = form.watch('comment')

  // Show form with animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  async function onSubmit(values: ReviewFormValues) {
    setIsSubmitting(true)
    try {
      await createNewReviewAction(productId, values.rating, values.comment)

      setShowSuccess(true)
      toast.success(
        existingRating ? 'Review updated successfully!' : 'Review submitted successfully!',
        {
          description: 'Thank you for sharing your feedback!',
          duration: 4000,
        }
      )

      form.reset({ rating: values.rating, comment: values.comment })
      form.clearErrors()

      // Hide success message after animation
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error: unknown) {
      let message = 'Failed to submit review. Please try again.'
      if (error instanceof Error) {
        message = error.message
      }
      toast.error(message, {
        description: 'Please check your connection and try again.',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }

  const getStarColor = (starValue: number) => {
    const rating = hoveredStar || currentRating
    if (starValue <= rating) {
      if (rating <= 2) return 'text-red-500 fill-red-500'
      if (rating <= 3) return 'text-orange-500 fill-orange-500'
      if (rating <= 4) return 'text-yellow-500 fill-yellow-500'
      return 'text-primary fill-primary'
    }
    return 'text-muted-foreground/30'
  }

  return (
    <AnimatePresence>
      {formVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="border-border/50 from-card/80 to-card/60 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-xl backdrop-blur-sm"
        >
          {/* Background decoration */}
          <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent" />

          {/* Success overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500"
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-green-700 dark:text-green-300"
                  >
                    Review Submitted!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-green-600 dark:text-green-400"
                  >
                    Thank you for your feedback
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-center"
            >
              <div className="from-primary/20 to-secondary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
                {existingRating ? (
                  <Edit className="text-primary h-8 w-8" />
                ) : (
                  <Star className="text-primary h-8 w-8" />
                )}
              </div>
              <h2 className="text-foreground text-3xl font-bold">
                {existingRating ? 'Edit Your Review' : 'Write a Review'}
              </h2>
              <p className="text-muted-foreground mt-2">
                Share your experience to help other customers
              </p>
            </motion.div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Rating Section */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <FormLabel className="text-lg font-semibold">
                          How would you rate this product?
                        </FormLabel>
                      </motion.div>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4 py-4">
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((starValue) => (
                              <motion.button
                                key={starValue}
                                type="button"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 0.4 + starValue * 0.1,
                                  type: 'spring',
                                  stiffness: 200,
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="focus:ring-primary/50 rounded-full p-1 focus:ring-2 focus:outline-none"
                                onClick={() => {
                                  field.onChange(starValue)
                                  form.trigger('rating')
                                }}
                                onMouseEnter={() => setHoveredStar(starValue)}
                                onMouseLeave={() => setHoveredStar(0)}
                              >
                                <Star
                                  className={`h-10 w-10 transition-all duration-200 ${getStarColor(
                                    starValue
                                  )}`}
                                />
                              </motion.button>
                            ))}
                          </div>

                          <AnimatePresence mode="wait">
                            {(hoveredStar || currentRating) > 0 && (
                              <motion.div
                                key={hoveredStar || currentRating}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-center"
                              >
                                <p className="text-foreground text-2xl font-bold">
                                  {ratingLabels[hoveredStar || currentRating]}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {hoveredStar || currentRating} out of 5 stars
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Comment Section */}
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FormLabel className="text-lg font-semibold">
                          Tell us about your experience
                        </FormLabel>
                        <p className="text-muted-foreground mt-1 text-sm">
                          What did you like or dislike? How did you use this product?
                        </p>
                      </motion.div>
                      <FormControl>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Textarea
                            placeholder="Share your thoughts about the product..."
                            className="border-border/50 bg-background/50 focus:border-primary/50 focus:ring-primary/20 min-h-[120px] resize-none rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 focus:ring-2"
                            {...field}
                          />
                          <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                            <span>Minimum 10 characters</span>
                            <span
                              className={
                                currentComment.length < 10 ? 'text-orange-500' : 'text-green-500'
                              }
                            >
                              {currentComment.length} characters
                            </span>
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting || currentRating === 0}
                    className="w-full"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="submitting"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Please wait...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="submit"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          {existingRating ? 'Update Review' : 'Submit Review'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Helper text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-muted-foreground text-center text-sm"
                >
                  <p>Your review will be visible to other customers after moderation</p>
                </motion.div>
              </form>
            </Form>
          </div>

          {/* Bottom decoration */}
          <div className="from-primary via-secondary to-primary absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreateReviewForm
