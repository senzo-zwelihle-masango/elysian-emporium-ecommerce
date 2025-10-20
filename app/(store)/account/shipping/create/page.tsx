import React from 'react'
import { Container } from '@/components/ui/container'
import CreateShippingForm from '@/components/forms/create/create-shipping'

const Memberships = () => {
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-md'}
      gap={'none'}
      flow={'none'}
      id="create"
      className="pt-24"
    >
      <CreateShippingForm />
    </Container>
  )
}

export default Memberships
