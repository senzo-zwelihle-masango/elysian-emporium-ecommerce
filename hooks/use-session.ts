'use client'

import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function useSignOut() {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          router.refresh()
          toast.success('Signed out.')
        },
      },
    })
  }

  return handleSignOut
}
