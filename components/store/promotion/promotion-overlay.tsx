'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Promotion } from '@/types/store/promotion'

interface PromotionOverlayProps {
  promotion: Promotion | null
  isOpen: boolean
  onClose: () => void
}

const PromotionOverlay = ({ promotion, isOpen, onClose }: PromotionOverlayProps) => {
  if (!promotion) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            className="h-[80vh] w-full max-w-4xl overflow-hidden p-0"
            showCloseButton={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-full flex-col"
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Promotion Image */}
              <div className="relative h-1/2 overflow-hidden">
                <Image
                  src={promotion.image}
                  alt={promotion.label}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Overlay Content */}
                <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                  <Badge variant="secondary" className="mb-3">
                    {promotion.brand.name}
                  </Badge>
                  <h2 className="mb-2 text-2xl font-bold">{promotion.label}</h2>
                  <p className="text-sm leading-relaxed opacity-90">{promotion.description}</p>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-6 text-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Explore This Promotion</h3>
                  <p className="text-muted-foreground text-sm">
                    Discover amazing products and exclusive deals
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button asChild>
                    <Link href={`/promotions/${promotion.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Products
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default PromotionOverlay
