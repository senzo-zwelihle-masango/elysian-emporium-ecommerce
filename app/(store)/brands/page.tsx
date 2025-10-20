import React from 'react'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'
import { fetchStoreBrands } from '@/app/api/store/brand'

const BrandsPage = async () => {
  noStore()
  const brands = await fetchStoreBrands()

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="brands"
      className="pt-24 pb-12"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
            Brands
          </Heading>
          <p className="text-muted-foreground">Discover products from your favorite brands</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input placeholder="Search brands..." className="pl-10" />
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="transition-shadow hover:shadow-md">
              <div className="bg-muted flex aspect-square items-center justify-center rounded-t-lg">
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={200}
                    height={200}
                    className="rounded-t-lg object-contain p-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
                )}
              </div>
              <CardHeader>
                <CardTitle>{brand.name}</CardTitle>
                <CardDescription>Browse {brand.productCount} products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {brand.productCount} products
                  </span>
                  <Button asChild>
                    <a href={`/products?brand=${brand.id}`}>View Products</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {brands.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <CardTitle className="mb-2">No Brands Available</CardTitle>
              <CardDescription>
                There are currently no brands available. Please check back later.
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}

export default BrandsPage
