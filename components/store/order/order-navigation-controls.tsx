'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react'

interface OrderNavigationControlsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onPlaceOrder: () => void
  isNextDisabled?: boolean
  isLoading?: boolean
}
const OrderNavigationControls = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPlaceOrder,
  isNextDisabled = false,
  isLoading = false,
}: OrderNavigationControlsProps) => {
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className="order-2 flex-1 sm:order-1 sm:flex-none"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
        <span className="sm:hidden">Previous Step</span>
      </Button>

      {isLastStep ? (
        <Button
          onClick={onPlaceOrder}
          disabled={isNextDisabled || isLoading}
          size="lg"
          className="bg-ultramarine-600 hover:bg-ultramarine-700 order-1 flex-1 sm:order-2 sm:flex-none"
        >
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircleIcon className="h-4 w-4" />
          )}
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={isNextDisabled || isLoading}
          size="lg"
          className="bg-ultramarine-600 hover:bg-ultramarine-700 order-1 flex-1 sm:order-2 sm:flex-none"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Continue</span>
          {isLoading ? (
            <LoaderIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}

export default OrderNavigationControls
