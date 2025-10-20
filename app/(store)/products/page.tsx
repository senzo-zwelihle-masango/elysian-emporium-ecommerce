import React from 'react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { serializeProducts } from '@/types/store/product'
import {
  fetchAllBrands,
  fetchAllCategories,
  fetchAllTags,
  fetchProducts,
} from '@/server/actions/store/filter'
import { ProductFilterSidebar } from '@/components/store/filter/filter-sidebar'
import ProductContainer from '@/components/store/product/product-container'

interface ProductsPageProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const resolvedSearchParams = (await searchParams) || {}

  // Safely parse numbers
  const parsedMinPrice =
    typeof resolvedSearchParams.minPrice === 'string'
      ? parseFloat(resolvedSearchParams.minPrice)
      : undefined
  const parsedMaxPrice =
    typeof resolvedSearchParams.maxPrice === 'string'
      ? parseFloat(resolvedSearchParams.maxPrice)
      : undefined

  // Fetch all necessary data in parallel
  const [rawProducts, availableCategories, availableTags, availableBrands] = await Promise.all([
    fetchProducts({
      search: resolvedSearchParams.search as string | undefined,
      category: resolvedSearchParams.category as string | undefined,
      minPrice: parsedMinPrice,
      maxPrice: parsedMaxPrice,
      sortBy: resolvedSearchParams.sortBy as string | undefined,
      tag: resolvedSearchParams.tag as string | undefined,
      brand: resolvedSearchParams.brand as string | undefined,
    }),
    fetchAllCategories(),
    fetchAllTags(),
    fetchAllBrands(),
  ])

  const products = serializeProducts(rawProducts)

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
      <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'sm'}>
        All Products
      </Heading>
      <div className="flex flex-col gap-6 md:flex-row">
        <ProductFilterSidebar
          resolvedSearchParams={resolvedSearchParams}
          availableCategories={availableCategories}
          availableBrands={availableBrands}
          availableTags={availableTags}
          maxAllowedPrice={200000}
        />
        <main className="md:w-3/4">
          <ProductContainer initialProducts={products} />
        </main>
      </div>
    </Container>
  )
}

export default ProductsPage
