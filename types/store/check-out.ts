import { MapPin, CreditCard, CheckCircle, ShoppingBagIcon } from 'lucide-react'

export interface Address {
  id: string
  fullName: string
  streetAddress: string
  streetAddress2?: string | null
  city: string
  suburb: string
  province: string
  postalCode: string
  country: string | null
  phoneNumber: string
  isDefault: boolean
  label: string
  userId: string
  type: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  images?: string | null
}

export interface ClientShoppingCart {
  userId: string
  items: CartItem[]
}

export interface CreatedOrder {
  id: string
  orderNumber?: string | null
  totalAmount: number
  status: string
  paymentMethod: string
}

export interface CheckoutTotals {
  subtotal: number
  vatAmount: number
  shippingCost: number
  totalAmount: number
}

export interface CheckoutState {
  items: CartItem[]
  selectedAddressId: string
  paymentMethod: string
  customerNotes: string
  totals: CheckoutTotals
}

export const paymentMethods = [
  {
    id: 'cashondelivery',
    name: 'cashondelivery',
    description:
      'Perfect if you prefer to pay in cash. Settle your payment directly with our driver when your order arrives.',
  },
  {
    id: 'mastercard',
    name: 'mastercard',
    description:
      'Pay instantly and securely using your Visa, Mastercard. Your transaction is processed immediately for a smooth checkout.',
  },

  {
    id: 'mobicred',
    name: 'mobicred',
    description:
      'A convenient online credit facility. Apply once and get instant access to revolving credit for your purchases.',
  },

  {
    id: 'ozow',
    name: 'ozow',
    description:
      'Instant EFT: Pay directly from your bank account. Enjoy immediate payment confirmation and no card details needed on our site.',
  },
  {
    id: 'payfast',
    name: 'payfast',
    description:
      'Our comprehensive payment gateway. Choose from various options including Instant EFT, Credit/Debit Cards, Mobicred, and more – all in one secure place.',
  },

  {
    id: 'payflex',
    name: 'payflex',
    description:
      'Buy now, pay later: Get your order today and split the cost into 4 interest-free installments over 6 weeks. No fees if you pay on time.',
  },

  {
    id: 'paypal',
    name: 'paypal',
    description:
      'Buy now, pay later: Get your order today and split the cost into 4 interest-free installments over 6 weeks. No fees if you pay on time.',
  },
  {
    id: 'snapscan',
    name: 'snapscan',
    description:
      'Buy now, pay later: Get your order today and split the cost into 4 interest-free installments over 6 weeks. No fees if you pay on time.',
  },
] as const

export type PaymentMethodId = (typeof paymentMethods)[number]['id']

// Checkout Steps
export const steps = [
  {
    id: 1,
    name: 'Review',
    icon: ShoppingBagIcon,
  },
  {
    id: 2,
    name: 'Shipping',
    icon: MapPin,
  },
  {
    id: 3,
    name: 'Payment',
    icon: CreditCard,
  },
  {
    id: 4,
    name: 'Confirmation',
    icon: CheckCircle,
  },
]

export type CheckoutStep = (typeof steps)[number]
