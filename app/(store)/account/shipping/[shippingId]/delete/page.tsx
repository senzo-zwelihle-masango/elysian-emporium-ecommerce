import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma/client'
import { notFound, redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { deleteShippingAddressAction } from '@/server/actions/user/shipping'
import { DeleteButton } from '@/components/ui/form-button'

type Params = Promise<{ shippingId: string }>

const Delete = async ({ params }: { params: Params }) => {
  const { shippingId } = await params

  const shippingAddress = await prisma.shipping.findUnique({
    where: { id: shippingId },
  })

  if (!shippingAddress) {
    return notFound()
  }

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-md'}
      gap={'none'}
      flow={'none'}
      id="delete"
      className="pt-24"
    >
      <Card className="bg-background mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the following address:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold">{shippingAddress.label}</h3>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/admin/users/memberships`}>Cancel</Link>
          </Button>
          <form
            action={async () => {
              'use server'
              await deleteShippingAddressAction(shippingId)
              redirect('/account/shipping')
            }}
          >
            <DeleteButton text="Delete" />
          </form>
        </CardFooter>
      </Card>
    </Container>
  )
}

export default Delete
