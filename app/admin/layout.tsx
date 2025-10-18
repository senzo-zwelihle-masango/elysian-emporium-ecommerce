import React from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import NavigationHeader from '@/components/admin/layout/navigation-header'
import AppSidebar from '@/components/admin/layout/app-sidebar'

const AdminDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // check user role
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/unauthorized')
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavigationHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminDashboardLayout
