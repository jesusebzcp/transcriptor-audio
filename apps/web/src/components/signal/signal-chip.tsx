import * as React from 'react'
import { cn } from '@/lib/utils'

type SignalChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  pulse?: boolean
  variant?: 'signal' | 'muted' | 'cream'
}

export function SignalChip({
  pulse = true,
  variant = 'signal',
  className,
  children,
  ...props
}: SignalChipProps) {
  const palette = {
    signal:
      'border-signal/30 bg-signal/10 text-signal',
    muted:
      'border-border bg-muted text-muted-foreground',
    cream:
      'border-ink/15 bg-ink/[0.04] text-ink dark:border-cream/15 dark:bg-cream/[0.04] dark:text-cream',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em]',
        palette[variant],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block size-1.5 rounded-full',
          variant === 'signal' ? 'bg-signal' : 'bg-muted-foreground',
          pulse && 'signal-dot'
        )}
      />
      {children}
    </span>
  )
}
