'use client'

import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { formatPoints } from '@/utils/store/membership'
import { User, Membership } from '@/lib/generated/prisma/client'

interface MembershipStatusProps {
  user: User & { membership: Membership | null }
}

export function MembershipStatus({ user }: MembershipStatusProps) {
  if (!user.membership) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Not a Member</h3>
            <p className="text-muted-foreground text-sm">
              Join to earn points and get exclusive benefits
            </p>
          </div>
          <Badge variant="outline">0 Points</Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{user.membership.crown}</span>
            <h3 className="font-medium">{user.membership.title} Member</h3>
          </div>
          <p className="text-muted-foreground text-sm">{user.membership.description}</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1 text-lg">
          {formatPoints(user.points)} Points
        </Badge>
      </div>
    </Card>
  )
}
