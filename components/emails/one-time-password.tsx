import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'

import { env } from '@/env/server'

interface OneTimePasswordEmailProps {
  userEmail: string
  username: string
  otp: string
  expirationMinutes?: number
}
const OneTimePasswordEmail = (props: OneTimePasswordEmailProps) => {
  const { userEmail, username, otp, expirationMinutes = 10 } = props
  const logoUrl = `${env.RESEND_EMAIL_LOGO}`
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Preview>Your verification code for Elysian Emporium</Preview>
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white shadow-sm">
            {/* Header */}
            <Section className="px-[32px] pt-[40px] pb-[24px]">
              <div className="text-center">
                <Img
                  src={logoUrl}
                  width="64"
                  height="64"
                  alt="Elysian Emporium Logo"
                  className="mx-auto rounded-[8px] border border-gray-200 bg-white p-[8px] shadow-sm"
                />
              </div>
            </Section>

            {/* Main Content */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="mb-[24px] text-center text-[32px] leading-[38px] font-bold text-gray-900">
                Verify Your Email Address
              </Heading>

              <Text className="mb-[24px] text-center text-[16px] leading-[24px] text-gray-700">
                Hello {username}, we received a request to verify your email address for your
                Elysian Emporium account.
              </Text>

              {/* OTP Code Box */}
              <Section className="mb-[32px] rounded-[12px] border-2 border-dashed border-gray-300 bg-gray-50 px-[24px] py-[32px]">
                <Text className="mb-[8px] text-center text-[36px] font-bold tracking-[8px] text-gray-900">
                  {otp}
                </Text>
                <Text className="text-center text-[14px] text-gray-600">
                  This code expires in {expirationMinutes} minutes
                </Text>
              </Section>

              {/* Instructions */}
              <Section className="mb-[32px]">
                <Text className="mb-[16px] text-[16px] leading-[24px] text-gray-700">
                  <strong>How to use this code:</strong>
                </Text>
                <Text className="mb-[8px] text-[14px] leading-[22px] text-gray-600">
                  1. Return to the verification page in your browser
                </Text>
                <Text className="mb-[8px] text-[14px] leading-[22px] text-gray-600">
                  2. Enter the 6-digit code above
                </Text>
                <Text className="mb-[16px] text-[14px] leading-[22px] text-gray-600">
                  3. Complete your account setup
                </Text>
              </Section>

              <Text className="mb-[24px] text-center text-[14px] leading-[22px] text-gray-600">
                If you didn&apos;t request this verification code, please ignore this email or{' '}
                <Link
                  href="mailto:support@elysianemporium.com"
                  className="text-[#4D00FF] underline"
                >
                  contact our support team
                </Link>{' '}
                if you have concerns about your account security.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="rounded-b-[8px] bg-gray-50 px-[32px] py-[24px]">
              <Text className="mb-[8px] text-center text-[12px] leading-[18px] text-gray-500">
                This email was sent to {userEmail}
              </Text>
              <Text className="mb-[16px] text-center text-[12px] leading-[18px] text-gray-500">
                Elysian Emporium, South Africa
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default OneTimePasswordEmail
