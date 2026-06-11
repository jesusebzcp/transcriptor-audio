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
      <div className='space-y-3'>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h1
          className='text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-foreground md:text-[2.5rem]'
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
      {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
    </header>
  )
}
