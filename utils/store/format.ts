import { Decimal } from '@prisma/client/runtime/library'

export function formatPrice(price: string | Decimal | number) {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(numericPrice)
}

export const dateFormat = (date: Date) => {
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
