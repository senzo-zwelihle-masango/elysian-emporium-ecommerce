'use server'
// basic meta config
import { GiftIcon, HeartIcon, Share2Icon, ShoppingBagIcon, StarIcon } from 'lucide-react'

export const MembershipActionMeta: Record<string, { label: string; icon: React.ComponentType }> = {
  welcome_bonus: { label: 'Welcome Bonus', icon: GiftIcon },
  shopping: { label: 'Shopping', icon: ShoppingBagIcon },
  write_review: { label: 'Review', icon: StarIcon },
  share_product: { label: 'Shared Product', icon: Share2Icon },
  add_to_favorites: { label: 'Added to Favorites', icon: HeartIcon },
}
