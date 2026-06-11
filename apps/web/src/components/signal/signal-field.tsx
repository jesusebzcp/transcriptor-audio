import * as React from 'react'
import { cn } from '@/lib/utils'
import { FieldLabel } from './field-label'

type SignalFieldProps = {
  index?: number
  label: React.ReactNode
  required?: boolean
  hint?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SignalField({
  index,
  label,
  required,
  hint,
  error,
  children,
  className,
}: SignalFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <FieldLabel index={index} required={required}>
        {label}
      </FieldLabel>
      <div className='group relative'>{children}</div>
      {error ? (
        <p className='font-mono text-[10px] uppercase tracking-wider text-destructive'>
          {error}
        </p>
      ) : hint ? (
        <p className='font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70'>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
