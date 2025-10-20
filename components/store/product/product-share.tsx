'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailIcon,
  EmailShareButton,
} from 'react-share'
import { ShareIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { trackProductShare } from '@/server/actions/store/interaction'

interface ProductShareProps {
  productId: string
  productName: string
  productUrl: string
  productImage?: string
}

export function ProductShare({ productId, productName, productUrl }: ProductShareProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleShare = async (platform: string) => {
    try {
      const result = await trackProductShare(productId)
      if (result.success) {
        if (result.pointsAwarded) {
          toast.success(`Shared on ${platform}!`, {
            description: "Thanks for sharing this product. You've earned points!",
          })
        } else {
          toast.success(`Shared on ${platform}!`, {
            description: 'Thanks for sharing this product.',
          })
        }
      } else {
        toast.error('Failed to track share', {
          description: 'error' in result ? result.error : 'Unknown error',
        })
      }
    } catch {
      toast.error('Error sharing product', {
        description: 'Failed to share the product. Please try again.',
      })
    }
  }

  const shareTitle = `Check out this amazing product: ${productName}`
  const shareDescription = `I found this great product and thought you might like it!`

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <ShareIcon className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this product</DialogTitle>
          <DialogDescription>Share {productName} with your friends and family</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap justify-center gap-4 py-4">
          <FacebookShareButton
            url={productUrl}
            hashtag="#product"
            onShareWindowClose={() => {
              handleShare('Facebook')
              setIsOpen(false)
            }}
            className="transition-transform hover:scale-110"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>

          <TwitterShareButton
            url={productUrl}
            title={shareTitle}
            onShareWindowClose={() => {
              handleShare('Twitter')
              setIsOpen(false)
            }}
            className="transition-transform hover:scale-110"
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>

          <LinkedinShareButton
            url={productUrl}
            title={shareTitle}
            summary={shareDescription}
            onShareWindowClose={() => {
              handleShare('LinkedIn')
              setIsOpen(false)
            }}
            className="transition-transform hover:scale-110"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>

          <WhatsappShareButton
            url={productUrl}
            title={shareTitle}
            onShareWindowClose={() => {
              handleShare('WhatsApp')
              setIsOpen(false)
            }}
            className="transition-transform hover:scale-110"
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>

          <EmailShareButton
            url={productUrl}
            subject={shareTitle}
            body={`${shareDescription}\n\n${productUrl}`}
            onShareWindowClose={() => {
              handleShare('Email')
              setIsOpen(false)
            }}
            className="transition-transform hover:scale-110"
          >
            <EmailIcon size={40} round />
          </EmailShareButton>
        </div>
        <div className="text-muted-foreground text-center text-sm">
          Click on any platform to share
        </div>
      </DialogContent>
    </Dialog>
  )
}
