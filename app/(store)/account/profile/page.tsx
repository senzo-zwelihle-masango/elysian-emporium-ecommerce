import React from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import UpdateProfileForm from '@/components/forms/update/update-profile'

const ProfilePage = async () => {
  // session check
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return (
      <div>
        <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
          Please sign in to edit your profile.
        </Heading>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, image: true, phoneNumber: true },
  })

  if (!user) {
    return (
      <div>
        <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
          User not found.
        </Heading>
      </div>
    )
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="profile"
      className="pt-24"
    >
      <UpdateProfileForm
        data={{
          name: user.name ?? '',
          image: user.image ?? '',
          phoneNumber: user.phoneNumber ?? '',
        }}
      />
    </Container>
  )
}

export default ProfilePage
