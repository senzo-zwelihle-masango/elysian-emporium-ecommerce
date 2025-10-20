import React from 'react'
import { unstable_noStore as noStore } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/container'
import UpdateShippingForm from '@/components/forms/update/update-shipping'

type Params = Promise<{ shippingId: string }>

async function fetchShippingAddressId(id: string) {
  noStore()
  const data = await prisma.shipping.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      label: true,
      type: true,
      fullName: true,
      phoneNumber: true,
      country: true,
      city: true,
      suburb: true,
      province: true,
      streetAddress: true,
      streetAddress2: true,
      postalCode: true,
      isDefault: true,
    },
  })

  if (!data) {
    return notFound()
  }

  return data
}

const Update = async ({ params }: { params: Params }) => {
  const { shippingId } = await params
  const data = await fetchShippingAddressId(shippingId)

  return (
    <Container
      id="update"
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      className="pt-20"
    >
      <UpdateShippingForm data={data} />
    </Container>
  )
}

export default Update
