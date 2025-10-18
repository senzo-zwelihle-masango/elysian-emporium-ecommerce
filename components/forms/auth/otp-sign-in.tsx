'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { toast } from 'sonner'

import { LoaderIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { authClient } from '@/lib/auth-client'

const OTPSignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  // next router config
  const router = useRouter()

  // button states to display pending states
  const [emailPending, startEmailTransition] = useTransition()

  //   keep track of email
  const [email, setEmail] = useState('')

  //   sign in with email
  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'sign-in',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email sent successfully')
            router.push(`/verify-request?email=${email}`)
          },
          onError: () => {
            toast.error(' Internal Server Error Email not sent.Please try again. ')
          },
        },
      })
    })
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button onClick={signInWithEmail} disabled={emailPending}>
                {emailPending ? (
                  <>
                    <LoaderIcon className="size-4 animate-spin" />
                    <span>Loading....</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}

export default OTPSignInForm
