'use client'

import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { formatPrice } from '@/types/store/product'
import { Product } from '@/types/store/product'

interface PromotionClientProps {
  promotion: {
    id: string
    label: string
    description: string
    image: string
    brand: {
      id: string
      name: string
      logo: string
    }
    products: Product[]
  }
}

const PromotionClient = ({ promotion }: PromotionClientProps) => {
  const router = useRouter()

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Promotions
        </Button>
      </motion.div>

      {/* Promotion Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[21/9]">
          <Image
            src={promotion.image}
            alt={promotion.label}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Overlay Content */}
          <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                <Tag className="mr-1 h-3 w-3" />
                {promotion.brand.name}
              </Badge>
              <Heading size="6xl" className="mb-4">
                {promotion.label}
              </Heading>
              <p className="text-lg leading-relaxed opacity-90">{promotion.description}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Images Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-12 gap-4 overflow-hidden pb-2 lg:pb-5">
          {promotion.products.flatMap((product) =>
            product.images.map((image, imageIndex) => {
              const totalImages = promotion.products.reduce((acc, p) => acc + p.images.length, 0)
              const globalIndex =
                promotion.products
                  .slice(0, promotion.products.indexOf(product))
                  .reduce((acc, p) => acc + p.images.length, 0) + imageIndex

              let colSpanClass = 'sm:col-span-6 col-span-12'
              if (globalIndex === 0) {
                colSpanClass = 'sm:col-span-5 col-span-12'
              } else if (globalIndex === 1) {
                colSpanClass = 'sm:col-span-7 col-span-12'
              } else if (globalIndex === totalImages - 2) {
                colSpanClass = 'sm:col-span-7 col-span-12'
              } else if (globalIndex === totalImages - 1) {
                colSpanClass = 'sm:col-span-5 col-span-12'
              }

              return (
                <motion.article
                  key={`${product.id}-${imageIndex}`}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ ease: 'easeOut', delay: globalIndex * 0.05 }}
                  viewport={{ once: false }}
                  className={`relative ${colSpanClass} group cursor-pointer`}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link href={`/product/${product.id}`} className="block h-full">
                    <div className="relative h-full w-auto overflow-hidden rounded-xl">
                      <Image
                        src={image}
                        alt={`${product.name} - Image ${imageIndex + 1}`}
                        height={600}
                        width={1200}
                        className="h-full w-full rounded-xl object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-all duration-500 group-hover:from-black/40" />
                    </div>
                  </Link>
                </motion.article>
              )
            })
          )}
        </div>
      </motion.div>

      {/* Product Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {promotion.products.map((product) => (
          <Button key={product.id} variant="outline" asChild>
            <Link href={`/product/${product.id}`}>
              {product.name} - {formatPrice(product.price)}
            </Link>
          </Button>
        ))}
      </motion.div>
    </div>
  )
}

export default PromotionClient
