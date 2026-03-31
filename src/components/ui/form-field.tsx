"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { cn } from "@/utils/cn"

export function FormFieldLabel({ 
  children, 
  className, 
  ...props 
}: React.ComponentProps<typeof Label>) {
  return (
    <Label 
      className={cn(
        "text-[11px] font-bold text-text-label uppercase tracking-wider",
        className
      )} 
      {...props}
    >
      {children}
    </Label>
  )
}

export interface FormFieldSelectProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
  triggerClassName?: string
  error?: string
}

export function FormFieldSelect({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  className,
  triggerClassName,
  error,
}: FormFieldSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn(
          "bg-surface-muted/50 border-border h-12 rounded-xl focus:ring-brand", 
          triggerClassName, 
          error && "border-error ring-error ring-1"
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border shadow-xl bg-surface">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="font-medium focus:bg-brand-light">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  )
}
