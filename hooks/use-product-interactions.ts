import { getProductShareCount, getProductViewCount } from '@/server/actions/store/interaction'
import { getProductInteractionStatistics } from '@/server/actions/store/statistic'
import { useState, useEffect } from 'react'

export function useProductInteractions(productId: string) {
  const [viewCount, setViewCount] = useState<number>(0)
  const [shareCount, setShareCount] = useState<number>(0)
  const [stats, setStats] = useState({
    views: 0,
    shares: 0,
    addToCart: 0,
    favorites: 0,
    purchases: 0,
    reviews: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setLoading(true)

        // Fetch view count
        const viewResult = await getProductViewCount(productId)
        if (viewResult.success) {
          setViewCount(viewResult.viewCount)
        }

        // Fetch share count
        const shareResult = await getProductShareCount(productId)
        if (shareResult.success) {
          setShareCount(shareResult.shareCount)
        }

        // Fetch detailed stats
        const statsResult = await getProductInteractionStatistics(productId)
        if (statsResult.success) {
          setStats(statsResult.stats)
        }
      } catch (error) {
        console.error('Error fetching product interactions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchInteractions()
    }
  }, [productId])

  return {
    viewCount,
    shareCount,
    stats,
    loading,
  }
}
