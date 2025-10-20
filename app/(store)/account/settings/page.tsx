import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'
import { UserSettingsForm } from '@/components/forms/settings/user-settings-form'
import { DeleteAccountSection } from '@/components/account/settings/delete-account'

const SettingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      image: true,
      role: true,
      emailVerified: true,
      notifications: {
        select: {
          id: true,
          type: true,
          read: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/auth/sign-in')
  }

  // Count unread notifications
  const unreadNotifications = user.notifications?.filter((n) => !n.read).length || 0

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="settings"
      className="pt-24"
    >
      <div className="space-y-6">
        <div>
          <Heading size={'6xl'} spacing={'normal'} lineHeight={'none'} margin={'none'}>
            Account Settings
          </Heading>
          <p className="text-muted-foreground">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Settings Content */}
          <div className="space-y-6 lg:col-span-2">
            <UserSettingsForm user={user} />

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>
                  Choose which emails and notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive important account updates and notifications
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive promotional offers and product updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter</Label>
                    <p className="text-muted-foreground text-sm">
                      Receive our monthly newsletter with curated content
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <DeleteAccountSection userId={user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-muted-foreground text-sm">
                    {user.emailVerified ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-yellow-600">Pending Verification</span>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-muted-foreground text-sm capitalize">{user.role}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-muted-foreground text-sm">{unreadNotifications} unread</p>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" disabled>
                  Verify Email Address
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" disabled>
                  Export Data
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Terms of Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default SettingsPage
