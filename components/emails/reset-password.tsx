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
  Button,
} from '@react-email/components'
import { env } from '@/env/server'

interface ResetPasswordEmailProps {
  username: string
  resetUrl: string
  userEmail: string
  updatedDate?: Date
}

const ResetPasswordEmail = (props: ResetPasswordEmailProps) => {
  const { username, resetUrl, userEmail, updatedDate } = props
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(updatedDate)
  const logoUrl = `${env.RESEND_EMAIL_LOGO}`

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] overflow-hidden rounded-[8px] bg-white shadow-lg">
            {/* Header with centered logo */}
            <Section className="bg-linear-to-r from-[#4D00FF] to-black px-[40px] py-[32px] text-center">
              <Img src={logoUrl} alt="Logo" className="mx-auto h-auto w-[120px] object-cover" />
            </Section>

            {/* Main content */}
            <Section className="px-[40px] py-[32px]">
              <Heading className="mt-0 mb-[16px] text-[24px] font-bold text-[#1a1a1a]">
                Reset Your Password
              </Heading>

              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-[#666666]">
                Hi {username},
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-[#666666]">
                We received a request to reset the password for your account associated with{' '}
                {userEmail}. If you made this request, click the button below to reset your
                password.
              </Text>

              {/* Reset button */}
              <Section className="mb-[32px] text-center">
                <Button
                  href={resetUrl}
                  className="box-border inline-block rounded-full bg-[#4D00FF] px-[32px] py-[12px] text-[16px] font-semibold text-white no-underline"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="mt-0 mb-[16px] text-[14px] leading-[20px] text-[#666666]">
                If the button doesn&apos;t work, you can copy and paste this link into your browser:
              </Text>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] break-all text-[#4D00FF]">
                <Link href={resetUrl} className="text-[#4D00FF] underline">
                  {resetUrl}
                </Link>
              </Text>

              <Text className="mt-0 mb-[16px] text-[14px] leading-[20px] text-[#666666]">
                <strong>Important:</strong> This link will expire in 24 hours for security reasons.
              </Text>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] text-[#666666]">
                If you didn&apos;t request a password reset, you can safely ignore this email. Your
                password will remain unchanged.
              </Text>

              {updatedDate && (
                <Text className="mt-0 mb-0 text-[12px] leading-[16px] text-[#999999]">
                  Request made on: {formattedDate}
                </Text>
              )}
            </Section>

            {/* Footer */}
            <Section className="border-t border-solid border-[#e5e5e5] bg-[#f8f9fa] px-[40px] py-[24px]">
              <Text className="m-0 mt-0 mb-[8px] text-[12px] leading-[16px] text-[#999999]">
                © 2025 Your Company Name. All rights reserved.
              </Text>
              <Text className="m-0 mt-0 mb-[8px] text-[12px] leading-[16px] text-[#999999]">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="m-0 mt-0 mb-0 text-[12px] leading-[16px] text-[#999999]">
                <Link href="#" className="text-[12px] text-[#4D00FF] underline">
                  Unsubscribe
                </Link>
                {' | '}
                <Link href="#" className="text-[12px] text-[#4D00FF] underline">
                  Privacy Policy
                </Link>
                {' | '}
                <Link href="#" className="text-[12px] text-[#4D00FF] underline">
                  Contact Support
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordEmail.PreviewProps = {
  username: 'streamer_pro',
  resetUrl: 'https://yoursite.com/reset-password?token=abc123xyz',
  userEmail: 'user@example.com',
  updatedDate: new Date(),
}

export default ResetPasswordEmail
