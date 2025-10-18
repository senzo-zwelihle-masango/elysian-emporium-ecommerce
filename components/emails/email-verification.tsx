import * as React from 'react'

import {
  Body,
  Button,
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

interface VerificationEmailProps {
  username: string
  verifyUrl: string
}

const EmailVerification = (props: VerificationEmailProps) => {
  const { username, verifyUrl } = props
  const logoUrl = `${env.RESEND_EMAIL_LOGO}`
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Preview>Verify your Elysian Emporium account</Preview>
          <Container className="mx-auto max-w-[600px]">
            {/* Header */}
            <Section className="px-[40px] pt-[48px] pb-[32px]">
              <Img
                src={logoUrl}
                width="48"
                height="48"
                alt="Elysian Emporium"
                className="mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="px-[40px] pb-[48px]">
              <Heading className="mb-[32px] text-center text-[28px] leading-[34px] font-semibold text-gray-900">
                Verify your email address
              </Heading>

              <Text className="mb-[32px] text-center text-[16px] leading-[24px] text-gray-700">
                Hi {username}, thanks for signing up! We need to verify your email address to
                complete your account setup.
              </Text>

              {/* Verify Button */}
              <Section className="mb-[32px] text-center">
                <Button
                  href={verifyUrl}
                  className="box-border inline-block rounded-full bg-[#4D00FF] px-[40px] py-[14px] text-[16px] font-medium text-white no-underline"
                >
                  Verify Email Address
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-[32px] text-center text-[14px] leading-[20px] text-gray-600">
                Or copy and paste this URL into your browser:
                <br />
                <Link href={verifyUrl} className="break-all text-[#4D00FF]">
                  {verifyUrl}
                </Link>
              </Text>

              {/* Additional Info */}
              <Text className="mb-[24px] text-center text-[14px] leading-[20px] text-gray-600">
                Once verified, you&apos;ll have full access to your Elysian Emporium account and can
                start exploring our premium collection.
              </Text>

              {/* Didn't Sign Up */}
              <Text className="text-center text-[14px] leading-[20px] text-gray-600">
                If you didn&apos;t create an account with us, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default EmailVerification
