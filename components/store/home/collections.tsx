import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'

import { Container } from '@/components/ui/container'

import { Collection } from '@/types/store/collection'

import { fetchActiveCollections } from '@/app/api/store/collection'
import CollectionCard from '../collection/collection-card'

async function fetchCollections(): Promise<Collection[]> {
  noStore()
  try {
    // console.log("Fetching collections from API...");
    const collections = await fetchActiveCollections()
    // console.log("Fetched collections:", collections.length);
    // console.log("Collections data:", JSON.stringify(collections, null, 2));
    return collections
  } catch {
    // console.error("Error fetching collections:", error);
    return []
  }
}

const Collections = async () => {
  noStore()
  const collections: Collection[] = await fetchCollections()

  //   console.log("Rendering collections:", collections.length);

  if (collections.length === 0) {
    return null
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="collections"
    >
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold md:text-5xl lg:text-6xl">Collections</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Discover curated selections of products grouped by themes, styles, and categories
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </Container>
  )
}

export default Collections
