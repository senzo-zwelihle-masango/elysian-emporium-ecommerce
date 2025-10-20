import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface MaintenanceStatus {
  enabled: boolean
  message: string
}

export function useMaintenance() {
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const response = await fetch('/api/maintenance')
        const data = await response.json()
        setMaintenanceStatus(data)

        // If maintenance is enabled and not on maintenance page, redirect
        if (data.enabled && window.location.pathname !== '/maintenance') {
          router.push('/maintenance')
        }
      } catch (error) {
        console.error('Failed to check maintenance status:', error)
        setMaintenanceStatus({ enabled: false, message: '' })
      } finally {
        setLoading(false)
      }
    }

    checkMaintenance()

    // Check every 5 minutes
    const interval = setInterval(checkMaintenance, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [router])

  return { maintenanceStatus, loading }
}
