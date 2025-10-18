import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import OtpSignIn from '@/components/forms/auth/otp-sign-in'

const OneTimePasswordSignInPage = async () => {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (session) {
    return redirect('/')
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <OtpSignIn />
    </div>
  )
}

export default OneTimePasswordSignInPage
