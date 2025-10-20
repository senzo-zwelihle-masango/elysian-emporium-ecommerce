'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import { awardPointsAction } from './points'

// Award points for daily login
export async function awardDailyLoginPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'daily_login')
}

// Award points for completing profile
export async function awardProfileCompletionPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'complete_profile')
}

// Award points for newsletter signup
export async function awardNewsletterSignupPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'newsletter_signup')
}

// Award points for referring a friend
export async function awardReferralPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'refer_friend')
}

// Award points for social sharing
export async function awardSocialSharePoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'social_share')
}

// Award points for product interactions (viewing details)
// Note: This is now called from the interaction tracking system, not directly
export async function awardProductInteractionPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'product_interaction')
}

// Award points for adding to cart
export async function awardAddToCartPoints() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'add_to_cart')
}

// Award points for completing a purchase
export async function awardPurchaseCompletedPoints(amount: number) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  return await awardPointsAction(session.user.id, 'purchase_completed', amount)
}
