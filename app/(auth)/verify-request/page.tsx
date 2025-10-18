'use client'

import React, { Suspense, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { toast } from 'sonner'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import ElysianEmporiumLogo from '@/components/ui/elysian-emporium-ecommerce-logo'

export default function VerificationRequestRoute() {
  return (
    <Suspense>
      <VerificationRequestPage />
    </Suspense>
  )
}

function VerificationRequestPage() {
  const router = useRouter()
  // store otp value
  const [otp, setOtp] = useState('')
  const [emailPending, startEmailTransition] = useTransition()
  //   fetch email from params
  const params = useSearchParams()
  const email = params.get('email') as string

  //   check if OTP is complete
  const isOtpComplete = otp.length === 6

  function verifyOtp() {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Email verfied successfully')
            router.push('/')
          },
          onError: () => {
            toast.error(' Internal Server Error Email not verified ')
          },
        },
      })
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md">
            <ElysianEmporiumLogo className="size-8 rounded-sm" />
          </div>
          Elysian Emporium Store.
        </a>
        {/* form */}
        <Card className="mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Please check your email</CardTitle>
            <CardDescription>Verfication code sent sucessfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <InputOTP
                maxLength={6}
                className="gap-2"
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-muted-foreground text-sm">
                Please enter the verification code sent to your email address.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={verifyOtp}
              disabled={emailPending || !isOtpComplete}
            >
              Verify Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
