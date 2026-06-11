import * as React from 'react'
import { cn } from '@/lib/utils'
import { SectionEyebrow } from './section-eyebrow'

type PageHeaderProps = React.HTMLAttributes<HTMLElement> & {
  eyebrow: string
  title: React.ReactNode
  highlight?: string
  description?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between',
        className
      )}
      {...props}
    >
      <div className='min-w-0 flex-1 space-y-3'>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1
          className='text-balance text-[1.875rem] leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[2.25rem] md:text-[2.5rem]'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
          {highlight && (
            <>
              {' '}
              <em className='italic text-signal'>{highlight}</em>
            </>
          )}
        </h1>
        {description && (
          <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className='flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap md:justify-end'>
          {actions}
        </div>
      )}
    </header>
  )
}
