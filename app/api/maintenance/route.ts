import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'

export async function GET() {
  try {
    const maintenance = await prisma.maintenance.findUnique({
      where: { id: 'default' },
    })

    return NextResponse.json({
      enabled: maintenance?.enabled ?? false,
      message:
        maintenance?.message ??
        'We are currently performing scheduled maintenance. Please check back soon.',
    })
  } catch (error) {
    console.error('Failed to check maintenance status:', error)
    return NextResponse.json({
      enabled: false,
      message: 'We are currently performing scheduled maintenance. Please check back soon.',
    })
  }
}
