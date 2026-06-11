import * as React from 'react'
import { cn } from '@/lib/utils'

type SectionEyebrowProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  tone?: 'signal' | 'muted'
}

export function SectionEyebrow({
  children,
  tone = 'signal',
  className,
  ...props
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]',
        tone === 'signal' ? 'text-signal' : 'text-muted-foreground',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block h-px w-6',
          tone === 'signal' ? 'bg-signal' : 'bg-muted-foreground/40'
        )}
      />
      {children}
    </div>
  )
}
