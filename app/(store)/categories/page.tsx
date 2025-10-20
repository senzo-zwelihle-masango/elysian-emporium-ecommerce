import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { SearchIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

import { prisma } from '@/lib/prisma/client'

async function fetchCategoriesWithImages() {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      products: {
        where: {
          status: 'active',
        },
        select: {
          id: true,
          images: true,
        },
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          products: {
            where: {
              status: 'active',
            },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    productCount: category._count.products,
    featuredImage: category.products[0]?.images[0] || null,
  }))
}

const CategoriesPage = async () => {
  noStore()
  const categories = await fetchCategoriesWithImages()

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="categories"
      className="pt-24 pb-12"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <Heading
            size={'6xl'}
            spacing={'normal'}
            lineHeight={'none'}
            margin={'none'}
            className="text-4xl md:text-5xl"
          >
            Shop by Category
          </Heading>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Discover our curated collection of products
          </p>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            {categories.length} Categories Available
          </Badge>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group bg-card text-card-foreground mx-auto h-[480px] w-full overflow-hidden rounded-md border p-2"
            >
              <figure className="bg-muted relative h-80 w-full overflow-hidden rounded-md p-2 transition-all duration-300 group-hover:h-72">
                <div className="from-primary/20 via-primary/10 absolute top-0 left-0 h-full w-full bg-gradient-to-br to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
                {category.featuredImage ? (
                  <Image
                    src={category.featuredImage}
                    alt={category.name}
                    width={600}
                    height={600}
                    className="group-hover:border-primary/20 absolute right-0 -bottom-1 h-64 w-[80%] rounded-lg border-4 object-cover transition-all duration-300 group-hover:-bottom-5 group-hover:border-4"
                  />
                ) : (
                  <div className="group-hover:border-primary/20 bg-muted absolute right-0 -bottom-1 flex h-64 w-[80%] items-center justify-center rounded-lg border-4 transition-all duration-300 group-hover:-bottom-5 group-hover:border-4">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
              </figure>
              <article className="space-y-2 p-4">
                <div className="bg-primary h-8 w-20 rounded-md"></div>
                <h1 className="text-xl font-semibold capitalize">{category.name}</h1>
                <p className="text-base leading-[120%]">
                  Discover amazing products in {category.name.toLowerCase()}
                </p>
                <Link
                  href={`/category/${category.id}`}
                  className="text-primary flex translate-y-2 gap-1 pt-2 text-base font-normal opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  Browse {category.name}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </article>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="bg-card text-card-foreground mx-auto h-[480px] w-full overflow-hidden rounded-md border p-2">
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl">
                <SearchIcon className="text-muted-foreground h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold">No Categories Available</h2>
              <p className="text-muted-foreground text-center text-base">
                There are currently no categories available. Please check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </Container>
  )
}

export default CategoriesPage
