import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { Container } from '@/components/ui/container'

import { Billboard } from '@/types/store/billboard'
import BillboardCarousel from '../billboard/billboard-carousel'

import { fetchActiveBillboards } from '@/app/api/store/billboard'

async function fetchBillboards(): Promise<Billboard[]> {
  noStore()
  // console.log("Fetching billboards...");
  try {
    const billboards = await fetchActiveBillboards()
    return billboards
  } catch {
    return []
  }
}

const Billboards = async () => {
  noStore()
  const billboards = await fetchBillboards()

  if (billboards.length === 0) {
    return (
      <div className="bg-muted flex h-96 w-full items-center justify-center rounded-xl">
        <p className="text-muted-foreground">No billboards available</p>
      </div>
    )
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="billboards"
      className="pt-28"
    >
      <BillboardCarousel billboards={billboards} />
    </Container>
  )
}

export default Billboards
