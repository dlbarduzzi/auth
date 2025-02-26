import type { VariantProps } from "class-variance-authority"

import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const spinnerVariants = cva("shrink-0 animate-soft-spin rounded-full border-4", {
  variants: {
    variant: {
      default: "border-indigo-50 border-t-indigo-300",
      neutral: "border-gray-300 border-t-gray-400",
    },
    size: {
      default: "size-10",
      sm: "size-8",
      xs: "size-6 border-[3px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type SpinnerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants>

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner }
