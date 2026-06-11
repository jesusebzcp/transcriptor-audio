import * as React from 'react'
import { cn } from '@/lib/utils'

type FieldLabelProps = React.HTMLAttributes<HTMLDivElement> & {
  index?: number
  children: React.ReactNode
  required?: boolean
}

export function FieldLabel({
  index,
  children,
  required,
  className,
  ...props
}: FieldLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground',
        className
      )}
      {...props}
    >
      <span>
        {index !== undefined && (
          <span className='me-1.5 text-signal'>{String(index).padStart(2, '0')}</span>
        )}
        {index !== undefined && <span className='me-1.5 text-muted-foreground/60'>·</span>}
        {children}
      </span>
      {required && (
        <span className='text-muted-foreground/60'>required</span>
      )}
    </div>
  )
}
