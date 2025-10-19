import React from 'react'
import { Wrench } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { getMaintenanceMessage } from '@/lib/maintenance'

const MaintenancePage = async () => {
  const message = await getMaintenanceMessage()

  return (
    <Container size="lg" alignment="center" height="screen" padding="px-md" gap="lg" flow="col">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <Wrench className="text-muted-foreground h-24 w-24" />
        </div>

        <div className="space-y-4">
          <Heading size="6xl" spacing="normal" lineHeight="none" margin="none">
            Site Under Maintenance
          </Heading>

          <p className="text-muted-foreground mx-auto max-w-md text-lg">{message}</p>
        </div>

        <div className="text-muted-foreground text-sm">
          <p>We apologize for any inconvenience.</p>
          <p>Please try again later.</p>
        </div>
      </div>
    </Container>
  )
}

export default MaintenancePage
