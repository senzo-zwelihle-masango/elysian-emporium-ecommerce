import React from 'react'
import { Container } from '@/components/ui/container'
import CreateExperienceForm from '@/components/forms/create/create-experience'
import { Heading } from '@/components/ui/heading'

const Experience = () => {
  return (
    <Container
      size={'md'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="product-id"
      className="space-y-8 pt-24"
    >
      {/* Header */}
      <div>
        <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'md'}>
          Experience
        </Heading>
      </div>
      <CreateExperienceForm />
    </Container>
  )
}

export default Experience
