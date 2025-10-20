import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Step = {
  id: number
  name: string
  icon: React.ComponentType<{ className?: string }>
}

interface ModernProgressIndicatorProps {
  currentStep: number
  steps: Step[]
}

const ModernProgressIndicator: React.FC<ModernProgressIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  const totalSteps = steps.length
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="mb-6 block lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-foreground text-base font-semibold">
            Step {currentStep} of {totalSteps}
          </h3>
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Mobile progress bar */}
        <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
          <div
            className="from-ultramarine-500 to-ultramarine-600 absolute top-0 left-0 h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </div>

        {/* Current step info */}
        <div className="bg-card mt-3 rounded-lg border p-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {(() => {
                const currentStepData = steps.find((step) => step.id === currentStep)
                const StepIcon = currentStepData?.icon
                return currentStep > totalSteps ? (
                  <div className="bg-ultramarine-600 flex h-6 w-6 items-center justify-center rounded-full">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                ) : StepIcon ? (
                  <div className="bg-ultramarine-600 flex h-6 w-6 items-center justify-center rounded-full">
                    <StepIcon className="h-4 w-4 text-white" />
                  </div>
                ) : null
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {steps.find((step) => step.id === currentStep)?.name || 'Complete'}
              </p>
              <p className="text-muted-foreground text-xs">
                {currentStep > totalSteps
                  ? 'Order completed successfully'
                  : 'Currently processing...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Progress Indicator */}
      <div className="hidden lg:block">
        <div className="relative px-4">
          {/* Background line */}
          <div className="bg-border absolute top-8 right-0 left-0 mx-8 h-0.5 rounded-full"></div>

          {/* Progress line */}
          <div
            className="from-ultramarine-500 to-ultramarine-600 absolute top-8 left-8 h-0.5 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
            style={{ width: `calc(${progressPercentage}% - 2rem)` }}
          ></div>

          {/* Steps container */}
          <div className="relative flex items-start justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id

              return (
                <div key={step.id} className="group flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={`relative flex h-16 w-16 transform items-center justify-center rounded-full border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'border-ultramarine-600 bg-ultramarine-600 shadow-ultramarine-600/20 text-white shadow-lg'
                        : isActive
                          ? 'border-ultramarine-500 bg-ultramarine-500 shadow-ultramarine-500/20 scale-105 text-white shadow-lg'
                          : 'border-border bg-card text-muted-foreground hover:border-ultramarine-300 hover:shadow-md'
                    }`}
                  >
                    {/* Pulse animation for active step */}
                    {isActive && (
                      <div className="border-ultramarine-300 absolute -inset-1 animate-ping rounded-full border-2 opacity-75"></div>
                    )}

                    {/* Icon */}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <StepIcon className="h-6 w-6" />
                      )}
                    </div>
                  </div>

                  {/* Step label */}
                  <div className="mt-3 max-w-[120px] text-center">
                    <p
                      className={`mb-1 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-ultramarine-600'
                          : isCompleted
                            ? 'text-ultramarine-700'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {step.name}
                    </p>

                    {/* Status indicator */}
                    <Badge
                      variant={isCompleted ? 'default' : isActive ? 'secondary' : 'outline'}
                      className={`text-xs ${
                        isCompleted
                          ? 'bg-ultramarine-600 hover:bg-ultramarine-700'
                          : isActive
                            ? 'bg-ultramarine-100 text-ultramarine-700 border-ultramarine-200'
                            : ''
                      }`}
                    >
                      {isCompleted ? 'Complete' : isActive ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernProgressIndicator
