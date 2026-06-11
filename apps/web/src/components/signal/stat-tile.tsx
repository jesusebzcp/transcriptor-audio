import * as React from 'react'
import { cn } from '@/lib/utils'

type StatTileProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  tone?: 'default' | 'signal'
}

export function StatTile({
  label,
  value,
  hint,
  tone = 'default',
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border/60 bg-card/40 p-5 transition-colors hover:border-signal/40',
        className
      )}
      {...props}
    >
      <span
        aria-hidden='true'
        className='absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100'
      />
      <div className='space-y-2'>
        <div className='font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
          {label}
        </div>
        <div
          className={cn(
            'text-3xl leading-none tracking-tight',
            tone === 'signal' ? 'text-signal' : 'text-foreground'
          )}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {value}
        </div>
        {hint && (
          <div className='font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70'>
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}
