import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        outline: "border border-input bg-background",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => {
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
})

Toggle.displayName = ToggleGroupPrimitive.Item.displayName ?? "Toggle"

export { Toggle, toggleVariants }
