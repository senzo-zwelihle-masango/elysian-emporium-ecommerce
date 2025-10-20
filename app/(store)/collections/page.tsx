import React from 'react'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'
import { SearchIcon } from 'lucide-react'

import { prisma } from '@/lib/prisma/client'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

async function fetchCollections() {
  noStore()
  const data = await prisma.collection.findMany({
    where: {
      status: 'active',
    },
    select: {
      id: true,
      label: true,
      description: true,
      image: true,
      categoryId: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return data.map((collection) => ({
    ...collection,
    productCount: 0,
  }))
}

const CollectionsPage = async () => {
  const collections = await fetchCollections()

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="collections"
      className="pt-24 pb-12"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
            Collections
          </Heading>
          <p className="text-muted-foreground">Curated selections of our finest products</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input placeholder="Search collections..." className="pl-10" />
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Card key={collection.id} className="transition-shadow hover:shadow-md">
              <div className="bg-muted flex aspect-video items-center justify-center rounded-t-lg">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.label}
                    width={400}
                    height={225}
                    className="rounded-t-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
                )}
              </div>
              <CardHeader>
                <CardTitle>{collection.label}</CardTitle>
                <CardDescription>
                  {collection.description || `Collection in category ${collection.categoryId}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">View collection</span>
                  <Button asChild>
                    <a href={`/collections/${collection.id}`}>View Collection</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {collections.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <CardTitle className="mb-2">No Collections Available</CardTitle>
              <CardDescription>
                There are currently no collections available. Please check back later.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}

export default CollectionsPage
