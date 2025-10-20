'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckoutTotals, PaymentMethodId, paymentMethods } from '@/types/store/check-out'
import { ShieldCheckIcon, DollarSignIcon } from 'lucide-react'
import Image from 'next/image'
import ZarIcon from '@/components/icons/zar'

interface PaymentFormProps {
  selectedPaymentMethod: PaymentMethodId
  onSelectPaymentMethod: (methodId: PaymentMethodId) => void
  customerNotes: string
  onCustomerNotesChange: (notes: string) => void
  totals: CheckoutTotals
}

const OrderPaymentForm = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
  customerNotes,
  onCustomerNotesChange,
  totals,
}: PaymentFormProps) => {
  const [notesExpanded, setNotesExpanded] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount)
  }

  const getLogoPath = (methodId: string) => {
    return `/svg/payment/${methodId.toLowerCase()}.svg`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 flex items-center text-lg font-semibold">Select Payment Method</h3>

        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={onSelectPaymentMethod}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-start space-x-3">
              <div>
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              </div>

              <div className="flex-1">
                <Label htmlFor={method.id} className="block cursor-pointer">
                  <div className="hover:border-primary relative overflow-hidden rounded-lg border p-4 transition-colors">
                    {/* Animated background for selected */}
                    <AnimatePresence>
                      {selectedPaymentMethod === method.id && (
                        <div className="bg-primary/5 absolute inset-0 rounded-lg" />
                      )}
                    </AnimatePresence>

                    <div className="relative z-10">
                      <div className="mb-2 flex items-center justify-between space-x-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative flex h-8 w-12 items-center justify-center rounded shadow-sm">
                            <Image
                              src={getLogoPath(method.id)}
                              alt={`${method.name} logo`}
                              width={40}
                              height={24}
                              className="object-contain"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = '<span class="text-lg">💳</span>'
                                }
                              }}
                            />
                          </div>

                          <span className="font-medium">{method.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {method.id === 'cashondelivery' && (
                            <div>
                              <Badge variant="outline" className="text-xs">
                                <ZarIcon className="mr-1 h-3 w-3" />
                                Cash
                              </Badge>
                            </div>
                          )}

                          <AnimatePresence>
                            {selectedPaymentMethod === method.id && (
                              <div>
                                <Badge className="bg-primary text-primary-foreground">
                                  <ShieldCheckIcon className="mr-1 h-3 w-3" />
                                  Selected
                                </Badge>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <div>
          <Label
            htmlFor="customerNotes"
            className="flex cursor-pointer items-center text-base font-semibold"
            onClick={() => setNotesExpanded(!notesExpanded)}
          >
            <span>Special Instructions (Optional)</span>
          </Label>

          <div>
            <Textarea
              id="customerNotes"
              placeholder="Any special delivery instructions or notes for your order..."
              value={customerNotes}
              onChange={(e) => onCustomerNotesChange(e.target.value)}
              className="mt-2 transition-all duration-300 focus:scale-[1.02]"
              rows={3}
              onFocus={() => setNotesExpanded(true)}
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/40 relative overflow-hidden rounded-lg border p-4">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500/30 via-green-500/60 to-green-500/30" />

        <h4 className="mb-2 flex items-center font-semibold">Order Summary</h4>

        <div className="text-muted-foreground space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>VAT (0%)</span>
            <span>{formatCurrency(totals.vatAmount)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{totals.shippingCost === 0 ? 'Free' : formatCurrency(totals.shippingCost)}</span>
          </div>

          <Separator className="my-2" />

          <div className="text-foreground flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(totals.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPaymentForm
