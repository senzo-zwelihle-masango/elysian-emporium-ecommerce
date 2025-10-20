'use client'

import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Address,
  CartItem,
  CheckoutState,
  paymentMethods,
  steps,
  PaymentMethodId,
} from '@/types/store/check-out'

import { createOrderAction, validateCartItemsAction } from '@/server/actions/store/order'
import OrderProgressIndicator from '@/components/store/order/order-progress-indicator'
import OrderNavigationControls from '@/components/store/order/order-navigation-controls'
import OrderCheckOutSummary from '@/components/store/order/order-check-out-summary'
import OrderShippingForm from '@/components/store/order/order-shipping-form'
import OrderPaymentForm from '@/components/store/order/order-payment-form'

interface CheckoutWizardProps {
  initialCartItems: CartItem[]
  initialAddresses: Address[]
}
const CheckoutWizard = ({ initialCartItems, initialAddresses }: CheckoutWizardProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [checkoutState, setCheckoutState] = useState<CheckoutState>(() => {
    const defaultAddress = initialAddresses.find((addr) => addr.isDefault)
    return {
      items: initialCartItems,
      selectedAddressId: defaultAddress?.id || '',
      paymentMethod: paymentMethods[0].id as PaymentMethodId,
      customerNotes: '',
      totals: {
        subtotal: 0,
        vatAmount: 0,
        shippingCost: 0,
        totalAmount: 0,
      },
    }
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoadingTotals, setIsLoadingTotals] = useState(false)
  const [isNextDisabled, setIsNextDisabled] = useState(false)

  // rendering steps

  // calculate totals
  const calculateAndSetTotals = useCallback(async () => {
    if (checkoutState.items.length === 0) {
      setCheckoutState((prevState) => ({
        ...prevState,
        totals: { subtotal: 0, vatAmount: 0, shippingCost: 0, totalAmount: 0 },
      }))
      return
    }

    setIsLoadingTotals(true)
    try {
      const result = await validateCartItemsAction(checkoutState.items)

      if (result.success && result.totals) {
        setCheckoutState((prevState) => ({
          ...prevState,
          totals: result.totals,
        }))
        setIsNextDisabled(false)
      } else {
        toast.error('Cart Error', {
          description:
            'Some items in your cart are no longer available or have price changes. Please review your cart.',
        })
        setIsNextDisabled(true)
      }
    } catch (error) {
      console.error('Failed to calculate totals:', error)
      toast.error('Error', {
        description: 'Failed to calculate order totals. Please try again.',
      })
      setIsNextDisabled(true)
    } finally {
      setIsLoadingTotals(false)
    }
  }, [checkoutState.items])

  useEffect(() => {
    calculateAndSetTotals()
  }, [calculateAndSetTotals])

  // handle wizard steps

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }
  const handleNext = () => {
    if (currentStep === 2) {
      if (!checkoutState.selectedAddressId) {
        toast.error('Shipping Address Required', {
          description: 'Please select or add a shipping address to proceed.',
        })
        setIsNextDisabled(true)
        return
      }
    }
    if (!isNextDisabled && currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  // place order
  const handlePlaceOrder = async () => {
    if (!checkoutState.selectedAddressId) {
      toast.error('Shipping Address Required', {
        description: 'Please select a shipping address before placing the order.',
      })
      return
    }
    if (!checkoutState.paymentMethod) {
      toast.error('Payment Method Required', {
        description: 'Please select a payment method before placing the order.',
      })
      return
    }
    if (checkoutState.items.length === 0 || checkoutState.totals.totalAmount <= 0) {
      toast.error('Cart Empty', {
        description: 'Your cart is empty or invalid. Please add items to your cart.',
      })
      return
    }

    startTransition(async () => {
      try {
        const orderData = {
          items: checkoutState.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            images: item.images,
          })),
          addressId: checkoutState.selectedAddressId,
          paymentMethod: checkoutState.paymentMethod as PaymentMethodId,
          customerNotes: checkoutState.customerNotes,
          totalAmount: checkoutState.totals.totalAmount,
          shippingCost: checkoutState.totals.shippingCost,
          vatAmount: checkoutState.totals.vatAmount,
        }

        const result = await createOrderAction(orderData)

        if (result.success && result.order) {
          toast.success('Order Placed!', {
            description: `Your order #${result.order.orderNumber} has been placed successfully.`,
          })
          router.push(`/account/orders/${result.order.id}`)
        } else {
          toast.error('Order Failed', {
            description: result.error || 'There was an issue placing your order. Please try again.',
          })
        }
      } catch (error) {
        console.error('Order placement failed:', error)
        toast.error('Error', {
          description: 'An unexpected error occurred while placing your order.',
        })
      }
    })
  }

  useEffect(() => {
    let disable = false
    if (currentStep === 1) {
      disable =
        checkoutState.items.length === 0 || isLoadingTotals || checkoutState.totals.totalAmount <= 0
    } else if (currentStep === 2) {
      disable = !checkoutState.selectedAddressId
    } else if (currentStep === 3) {
      disable = !checkoutState.paymentMethod
    } else if (currentStep === 4) {
      disable =
        !checkoutState.selectedAddressId ||
        !checkoutState.paymentMethod ||
        checkoutState.items.length === 0 ||
        checkoutState.totals.totalAmount <= 0
    }
    setIsNextDisabled(disable)
  }, [
    currentStep,
    checkoutState.selectedAddressId,
    checkoutState.paymentMethod,
    checkoutState.items.length,
    checkoutState.totals.totalAmount,
    isLoadingTotals,
  ])

  // render wizrd steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-xl lg:text-2xl">Review Your Cart</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Please review the items in your cart and ensure everything is correct.
              </CardDescription>
            </div>

            <OrderCheckOutSummary items={checkoutState.items} totals={checkoutState.totals} />
          </div>
        )
      case 2:
        return (
          <OrderShippingForm
            initialAddresses={initialAddresses}
            selectedAddressId={checkoutState.selectedAddressId}
            onSelectAddress={(id) =>
              setCheckoutState((prev) => ({ ...prev, selectedAddressId: id }))
            }
          />
        )
      case 3:
        return (
          <OrderPaymentForm
            selectedPaymentMethod={checkoutState.paymentMethod as PaymentMethodId}
            onSelectPaymentMethod={(id) =>
              setCheckoutState((prev) => ({ ...prev, paymentMethod: id }))
            }
            customerNotes={checkoutState.customerNotes}
            onCustomerNotesChange={(notes) =>
              setCheckoutState((prev) => ({ ...prev, customerNotes: notes }))
            }
            totals={checkoutState.totals}
          />
        )
      case 4:
        return (
          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-xl lg:text-2xl">Confirm Your Order</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Please review all details before placing your order.
              </CardDescription>
            </div>

            <OrderCheckOutSummary items={checkoutState.items} totals={checkoutState.totals} />

            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
              <Card className="bg-muted/40 border p-4 lg:p-6">
                <h4 className="mb-3 text-sm font-semibold lg:text-base">Shipping Details</h4>

                {checkoutState.selectedAddressId ? (
                  initialAddresses
                    .filter((addr) => addr.id === checkoutState.selectedAddressId)
                    .map((addr) => (
                      <div key={addr.id} className="text-muted-foreground space-y-1 text-sm">
                        <p className="text-foreground font-medium">{addr.fullName}</p>
                        <p>{addr.streetAddress}</p>
                        {addr.streetAddress2 && <p>{addr.streetAddress2}</p>}
                        <p>
                          {addr.city}, {addr.province} {addr.postalCode}
                        </p>
                        <p>{addr.country}</p>
                        <p>Phone: {addr.phoneNumber}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-destructive text-sm">No shipping address selected.</p>
                )}
              </Card>

              <Card className="bg-muted/40 border p-4 lg:p-6">
                <h4 className="mb-3 text-sm font-semibold lg:text-base">Payment Method</h4>

                {checkoutState.paymentMethod ? (
                  <p className="text-muted-foreground text-sm">
                    {paymentMethods.find((pm) => pm.id === checkoutState.paymentMethod)?.name ||
                      'Not selected'}
                  </p>
                ) : (
                  <p className="text-destructive text-sm">No payment method selected.</p>
                )}
              </Card>
            </div>

            {checkoutState.customerNotes && (
              <Card className="bg-muted/40 border p-4 lg:p-6">
                <h4 className="mb-3 text-sm font-semibold lg:text-base">Customer Notes</h4>

                <p className="text-muted-foreground text-sm">{checkoutState.customerNotes}</p>
              </Card>
            )}
          </div>
        )
      default:
        return null
    }
  }
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <div className="space-y-6 lg:space-y-8">
        <OrderProgressIndicator currentStep={currentStep} steps={steps} />

        <div className="bg-card rounded-lg border p-4 shadow-sm sm:p-6 lg:p-8">
          {renderStepContent()}
        </div>
      </div>

      <div className="mt-6 border-t pt-6 lg:mt-8">
        <OrderNavigationControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPlaceOrder={handlePlaceOrder}
          isNextDisabled={isNextDisabled}
          isLoading={isPending || isLoadingTotals}
        />
      </div>
    </div>
  )
}

export default CheckoutWizard
