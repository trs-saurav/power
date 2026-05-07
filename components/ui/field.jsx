import * as React from "react"
import { cn } from "@/lib/utils"

const FieldGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FieldDescription.displayName = "FieldDescription"

const FieldSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex items-center",
      className
    )}
    {...props}
  >
    <div className="flex-1 border-t border-border" data-slot="field-separator-line-1"></div>
    <div className="px-2 text-xs text-muted-foreground font-medium" data-slot="field-separator-content">
      {props.children}
    </div>
    <div className="flex-1 border-t border-border" data-slot="field-separator-line-2"></div>
  </div>
))
FieldSeparator.displayName = "FieldSeparator"

export { FieldGroup, Field, FieldLabel, FieldDescription, FieldSeparator }
