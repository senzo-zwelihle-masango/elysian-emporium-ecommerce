import React from 'react'
import Link from 'next/link'

import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import ElysianErrorLogo from '@/components/ui/elysian-error-logo'
import { ArrowLeftIcon } from 'lucide-react'

const Unauthorized = () => {
  return (
    <Container
      id="unauthorized"
      size={'2xl'}
      alignment={'center'}
      height={'screen'}
      padding={'px-sm'}
      gap={'none'}
      flow={'col'}
      className="space-y-6"
    >
      <ElysianErrorLogo className="size-20" />
      <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} weight={'bold'} margin={'none'}>
        401
      </Heading>

      <div className="mx-auto max-w-4xl space-y-2">
        <p className="font-medium text-pretty">You don&apos;t have permission to view this page.</p>
        <p className="text-pretty">
          This usually happens if you&apos;re not signed in or your account doesn&apos;t have the
          right access. Please sign in again or reach out to our support team if you believe this is
          a mistake.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-4">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeftIcon /> Home
          </Button>
        </Link>

        <Link href="sign-in">
          <Button variant="secondary">Sign In</Button>
        </Link>
      </div>

      <p className="text-muted-foreground mt-6 text-xs">
        Error code: <span className="font-aeonik-mono">401 Unauthorized</span>
      </p>
    </Container>
  )
}

export default Unauthorized
