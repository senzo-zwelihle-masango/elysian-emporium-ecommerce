import React from 'react'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, TagIcon } from 'lucide-react'
import { prisma } from '@/lib/prisma/client'

async function fetchPromotions() {
  noStore()
  const data = await prisma.promotion.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      products: {
        where: {
          status: 'active',
        },
        select: {
          id: true,
        },
      },
      tags: {
        select: {
          label: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Add product count to each promotion
  return data.map((promotion) => ({
    ...promotion,
    productCount: promotion.products.length,
  }))
}

const PromotionsPage = async () => {
  const promotions = await fetchPromotions()

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="promotions"
      className="pt-24 pb-12"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
            Promotions
          </Heading>
          <p className="text-muted-foreground">
            Take advantage of our special offers and discounts
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input placeholder="Search promotions..." className="pl-10" />
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="transition-shadow hover:shadow-md">
              <div className="bg-muted flex aspect-video items-center justify-center rounded-t-lg">
                {promotion.image ? (
                  <Image
                    src={promotion.image}
                    alt={promotion.label}
                    width={400}
                    height={225}
                    className="rounded-t-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{promotion.label}</CardTitle>
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold">
                    New Arrivals
                  </span>
                </div>
                <CardDescription>{promotion.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <TagIcon className="h-4 w-4" />
                    <span>{promotion.productCount} products</span>
                  </div>
                  <Button asChild>
                    <a href={`/products?promotion=${promotion.id}`}>View Deal</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {promotions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <CardTitle className="mb-2">No Promotions Available</CardTitle>
              <CardDescription>
                There are currently no promotions running. Please check back later for special
                offers.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}

export default PromotionsPage
