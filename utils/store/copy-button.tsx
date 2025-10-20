'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [hasCopied])

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setHasCopied(true)
        toast.success('Copied to clipboard!')
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CheckIcon className="size-4 text-green-500" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </Button>
  )
}
