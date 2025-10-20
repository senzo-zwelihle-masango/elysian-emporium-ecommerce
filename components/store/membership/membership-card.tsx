'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckIcon, SparklesIcon } from 'lucide-react'
import { GlowEffect } from '@/components/motion-primitives/glow-effect'
import { toast } from 'sonner'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

import { Membership, MembershipHistory } from '@/lib/generated/prisma/client'

import {
  getMembershipBenefits,
  getNextTierBenefits,
  getPointsToNextTier,
  formatPoints,
  getProgressToNextTier,
} from '@/utils/store/membership'

import { signUpForMembershipAction } from '@/server/actions/user/actions'

interface MembershipInfo {
  user: {
    id: string
    name: string
    points: number
    membership: Membership | null
    membershipHistory: MembershipHistory[]
  }
  allTiers: Membership[]
}

interface MembershipCardProps {
  membershipInfo: MembershipInfo
}

export function MembershipCard({ membershipInfo }: MembershipCardProps) {
  const { user, allTiers } = membershipInfo
  const [isSigningUp, setIsSigningUp] = useState(false)
  const router = useRouter()

  const handleSignUp = async () => {
    setIsSigningUp(true)
    try {
      const result = await signUpForMembershipAction()
      if (result.status === 'signed_up') {
        toast('Membership Activated!', {
          description: "You've successfully joined our membership program.",
        })
        // Refresh the page to show updated membership info
        router.refresh()
      } else if (result.status === 'already') {
        toast('Already a Member', {
          description: "You're already enrolled in our membership program.",
        })
      }
    } catch {
      toast('Error', {
        description: 'Failed to sign up for membership. Please try again.',
      })
    } finally {
      setIsSigningUp(false)
    }
  }

  if (!user.membership) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Join Our Membership Program</CardTitle>
          <CardDescription>
            Unlock exclusive benefits and earn rewards with every purchase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium">Benefits of joining:</h3>
            <ul className="space-y-2">
              {getMembershipBenefits(null).map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignUp} disabled={isSigningUp} className="w-full">
            {isSigningUp ? 'Joining...' : 'Join Membership Program'}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const nextTierBenefits = getNextTierBenefits(user.membership, allTiers)
  const pointsToNextTier = getPointsToNextTier(user.points, user.membership, allTiers)
  const progressToNextTier = getProgressToNextTier(user.points, user.membership, allTiers)
  const nextTier = allTiers.find((t) => user.membership && t.minPoints > user.membership.minPoints)

  return (
    <div className="space-y-6">
      {/* Current Membership Card */}
      <div className="relative">
        <GlowEffect
          colors={['#0894FF', '#C959DD', '#FF2E54', '#FF9004']}
          mode="breathe"
          blur="medium"
        />
        <Card className="relative flex flex-col pt-12">
          {user.membership.popular && (
            <Badge className="absolute top-0 right-0 flex translate-x-1 -translate-y-1 items-center justify-center space-x-2 tabular-nums">
              Popular
              <SparklesIcon className="size-4" />
            </Badge>
          )}

          {/* Crown Image Container */}
          {user.membership.crown && (
            <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center">
              <Image
                src={user.membership.crown}
                alt={`${user.membership.title} crown`}
                width={16}
                height={16}
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-16 w-16 object-contain"
              />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-center font-medium">{user.membership.title}</CardTitle>

            {/* Points display */}
            <div className="my-2 flex items-center justify-center space-x-2">
              <span className="text-xl font-semibold">{formatPoints(user.points)}</span>
              <span className="text-muted-foreground text-sm">Points</span>
            </div>

            <div className="text-center text-sm font-semibold">
              {user.membership.minPoints} - {user.membership.maxPoints} Points
            </div>
            <CardDescription className="text-center text-sm">
              {user.membership.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Progress to next tier */}
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Progress to {nextTier.title}</span>
                  <span className="text-muted-foreground">
                    {formatPoints(pointsToNextTier)} points needed
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-2" />
              </div>
            )}

            <hr className="border-dashed" />

            <ul className="list-outside space-y-3 text-sm">
              {getMembershipBenefits(user.membership).map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckIcon className="size-3" />
                  {benefit}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Tier Benefits Grid */}
      {nextTierBenefits.length > 0 && (
        <div className="py-4">
          <h2 className="mb-10 text-lg font-semibold">
            Unlock More Benefits in {nextTier?.title} Tier
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allTiers
              .filter((tier) => user.membership && tier.minPoints > user.membership.minPoints)
              .map((tier) => (
                <Card key={tier.id} className="relative flex flex-col pt-12 opacity-60">
                  {tier.popular && (
                    <Badge className="absolute top-0 right-0 flex translate-x-1 -translate-y-1 items-center justify-center space-x-2 tabular-nums">
                      Popular
                      <SparklesIcon className="size-4" />
                    </Badge>
                  )}

                  {/* Crown Image Container */}
                  {tier.crown && (
                    <div className="absolute inset-x-0 top-0 flex -translate-y-1/2 items-center justify-center">
                      <Image
                        src={tier.crown}
                        alt={`${tier.title} crown`}
                        width={16}
                        height={16}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="h-16 w-16 object-contain grayscale"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-muted-foreground text-center font-medium">
                      {tier.title}
                    </CardTitle>

                    <div className="text-muted-foreground text-center text-sm font-semibold">
                      {tier.minPoints} - {tier.maxPoints} Points
                    </div>
                    <CardDescription className="text-center text-sm">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <hr className="border-dashed" />
                    <ul className="list-outside space-y-3 text-sm">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="text-muted-foreground flex items-center gap-2">
                          <CheckIcon className="size-3" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
