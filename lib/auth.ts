import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { organization } from 'better-auth/plugins'
import { lastLoginMethod } from 'better-auth/plugins'
import { emailOTP } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'

import { prisma } from '@/lib/prisma/client'
import { env } from '@/env/server'
import { resend } from '@/lib/email/resend'

import ResetPasswordEmail from '@/components/emails/reset-password'
import EmailVerification from '@/components/emails/email-verification'
import OneTimePasswordEmail from '@/components/emails/one-time-password'

export const auth = betterAuth({
  // database configuration and other options go here
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // basic authentication
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      resend.emails.send({
        from: 'Elysian Emporium Ecommerce <onboarding@resend.dev>',
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmail({
          username: user.name,
          resetUrl: url,
          userEmail: user.email,
        }),
      })
    },
    requireEmailVerification: false,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      resend.emails.send({
        from: 'Elysian Emporium Ecommerce <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify your email',
        react: EmailVerification({ username: user.name, verifyUrl: url }),
      })
    },
    sendOnSignUp: true,
  },

  //   social logins
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  // plugins
  plugins: [
    admin(),
    organization(),
    lastLoginMethod(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        // sending otp to user
        await resend.emails.send({
          from: 'Elysian Emporium Store <onboarding@resend.dev>',
          to: [email],
          subject: 'One time Password Verification',
          react: OneTimePasswordEmail({
            username: email,
            userEmail: email,
            otp,
          }),
        })
      },
    }),
    nextCookies(),
  ],
})
