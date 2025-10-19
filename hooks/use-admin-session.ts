import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export async function useIsAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/sign-in')
  }

  // role chceck

  if (session.user.role !== 'admin') {
    return redirect('/unauthorized')
  }

  return session
}
