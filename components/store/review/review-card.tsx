import { useState } from 'react'
import { Star, MessageCircle, Calendar, MoreHorizontal, Heart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { ReviewCardProps } from '@/interfaces/review'

export function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20))
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  const userName = `${review.user.name || 'Anonymous'} ${review.user.name || ''}`.trim()

  const userInitials = `${review.user.name?.[0] || ''}${review.user.name?.[0] || ''}`.trim()

  const fallbackImage = `https://avatar.vercel.sh/${encodeURIComponent(userName || 'User')}`

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const isLongComment = review.comment.length > 200
  const displayComment =
    isLongComment && !isExpanded ? review.comment.slice(0, 200) + '...' : review.comment

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 },
      }}
      className="group border-border/50 from-card/80 to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Subtle background gradient overlay */}
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            <Avatar className="ring-primary/20 group-hover:ring-primary/40 h-12 w-12 ring-2 transition-all duration-300">
              <AvatarImage
                src={review.user.image || fallbackImage}
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="from-primary/20 to-secondary/20 text-foreground bg-gradient-to-br font-semibold">
                {userInitials || 'U'}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="border-card absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 bg-green-500 shadow-sm" />
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.h4
              className="text-foreground truncate text-lg font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {userName}
            </motion.h4>
            <div className="mt-1 flex items-center space-x-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.3 + i * 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <Star
                      className={`h-4 w-4 transition-colors duration-200 ${
                        i < review.rating
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Comment */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className="relative mb-4"
      >
        <p className="text-foreground/90 text-sm leading-relaxed sm:text-base">{displayComment}</p>
        {isLongComment && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 mt-2 text-sm font-medium transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </motion.button>
        )}
      </motion.div>

      {/* Actions */}
      <div className="border-border/30 flex items-center justify-between border-t pt-4">
        {/* <div className="flex items-center space-x-4">
          <motion.button
            onClick={handleLike}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200 group/like"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-4 w-4 transition-all duration-200 ${
                  isLiked
                    ? "text-red-500 fill-red-500"
                    : "group-hover/like:text-red-400"
                }`}
              />
            </motion.div>
            <span className="text-sm font-medium">{likeCount}</span>
          </motion.button>

          <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Reply</span>
          </button>
        </div> */}

        <div className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1 text-xs">
          Verified Purchase
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="from-primary/10 to-secondary/10 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  )
}
