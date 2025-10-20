'use client'

import React from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { MoveUpRight } from 'lucide-react'
import { Promotion } from '@/types/store/promotion'
import { Badge } from '@/components/ui/badge'

interface PromotionGridProps {
  promotions: Promotion[]
}

const PromotionGrid = ({ promotions }: PromotionGridProps) => {
  if (promotions.length === 0) {
    return (
      <div className="bg-muted flex h-96 w-full items-center justify-center rounded-xl">
        <p className="text-muted-foreground">No promotions available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12 gap-4 overflow-hidden pb-2 lg:pb-5">
      {promotions.map((promotion, index) => {
        let colSpanClass = 'sm:col-span-6 col-span-12'
        if (index === 0) {
          colSpanClass = 'sm:col-span-5 col-span-12'
        } else if (index === 1) {
          colSpanClass = 'sm:col-span-7 col-span-12'
        } else if (index === promotions.length - 2) {
          colSpanClass = 'sm:col-span-7 col-span-12'
        } else if (index === promotions.length - 1) {
          colSpanClass = 'sm:col-span-5 col-span-12'
        }

        return (
          <motion.article
            key={promotion.id}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ ease: 'easeOut' }}
            viewport={{ once: false }}
            className={`relative ${colSpanClass} group cursor-pointer`}
            whileHover={{ scale: 1.02 }}
          >
            <Link href={`/promotions/${promotion.id}`} className="block h-full">
              <div className="relative h-full w-auto overflow-hidden rounded-xl">
                <Image
                  src={promotion.image}
                  alt={promotion.label}
                  height={600}
                  width={1200}
                  className="h-full w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
              <div className="absolute bottom-0 flex w-full items-center justify-between p-4 text-black lg:bottom-2">
                <div>
                  <h3 className="rounded-xl bg-black p-2 px-4 text-sm text-white transition-transform duration-300 group-hover:scale-105 lg:text-xl">
                    {promotion.label}
                  </h3>
                  <Badge className="mt-1 transition-transform duration-300 group-hover:scale-105">
                    {promotion.brand.name}
                  </Badge>
                </div>
                <div className="group-hover:bg-primary grid h-10 w-10 place-content-center rounded-full bg-black text-white transition-all duration-300 group-hover:scale-110 lg:h-12 lg:w-12">
                  <MoveUpRight className="transition-transform duration-300 group-hover:rotate-12" />
                </div>
              </div>
            </Link>
          </motion.article>
        )
      })}
    </div>
  )
}

export default PromotionGrid
