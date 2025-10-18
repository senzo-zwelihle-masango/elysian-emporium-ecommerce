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

interface InvitationEmailProps {
  inviterName: string
  organizationName: string
  acceptUrl: string
}

const InvitationEmail = (props: InvitationEmailProps) => {
  const { inviterName, organizationName, acceptUrl } = props
  const logoUrl = `${env.RESEND_EMAIL_LOGO}`

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Preview>You&apos;ve been invited to join {organizationName}</Preview>
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
                Join {organizationName}
              </Heading>

              <Text className="mb-[32px] text-center text-[16px] leading-[24px] text-gray-700">
                Hi there, you have been invited by {inviterName} to join the organization &apos;
                {organizationName}&apos;.
              </Text>

              {/* Accept Button */}
              <Section className="mb-[32px] text-center">
                <Button
                  href={acceptUrl}
                  className="box-border inline-block rounded-full bg-[#4D00FF] px-[40px] py-[14px] text-[16px] font-medium text-white no-underline"
                >
                  Accept Invitation
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="mb-[32px] text-center text-[14px] leading-[20px] text-gray-600">
                Or copy and paste this URL into your browser:
                <br />
                <Link href={acceptUrl} className="break-all text-[#4D00FF]">
                  {acceptUrl}
                </Link>
              </Text>

              {/* Didn't Sign Up */}
              <Text className="text-center text-[14px] leading-[20px] text-gray-600">
                If you believe this is an error, you can safely ignore this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default InvitationEmail
