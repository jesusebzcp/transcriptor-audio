import * as React from 'react'
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type StatusVariant =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  status: StatusVariant
  label?: string
}

const DEFAULT_LABEL: Record<StatusVariant, string> = {
  queued: 'En cola',
  processing: 'Procesando',
  completed: 'Listo',
  failed: 'Error',
}

const PALETTE: Record<
  StatusVariant,
  {
    wrap: string
    dot: string
    text: string
  }
> = {
  queued: {
    wrap: 'border-sky-400/30 bg-sky-400/10 text-sky-300 dark:text-sky-300',
    dot: 'bg-sky-400',
    text: 'text-sky-300',
  },
  processing: {
    wrap: 'border-signal/40 bg-signal/10 text-signal',
    dot: 'bg-signal',
    text: 'text-signal',
  },
  completed: {
    wrap: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  failed: {
    wrap: 'border-destructive/40 bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
    text: 'text-destructive',
  },
}

export function StatusBadge({
  status,
  label,
  className,
  ...props
}: StatusBadgeProps) {
  const palette = PALETTE[status]
  return (
    <span
      data-status={status}
      className={cn(
        'inline-flex h-7 items-center gap-2 rounded-full border px-2.5 font-mono text-[10px] uppercase tracking-[0.22em]',
        palette.wrap,
        className
      )}
      {...props}
    >
      <StatusIcon status={status} />
      <span className={cn('leading-none', palette.text)}>
        {label ?? DEFAULT_LABEL[status]}
      </span>
      {status === 'processing' && <Dots />}
    </span>
  )
}

function StatusIcon({ status }: { status: StatusVariant }) {
  if (status === 'queued') {
    return <Clock className='size-3.5 text-sky-300' aria-hidden='true' />
  }
  if (status === 'processing') {
    return (
      <span className='relative inline-flex size-3.5 items-center justify-center'>
        <span className='absolute inset-0 animate-ping rounded-full bg-signal/40' />
        <Loader2
          className='relative size-3.5 animate-spin text-signal'
          aria-hidden='true'
        />
      </span>
    )
  }
  if (status === 'completed') {
    return (
      <CheckCircle2
        className='tick-pop size-3.5 text-emerald-400'
        aria-hidden='true'
      />
    )
  }
  return (
    <XCircle
      className='error-shake size-3.5 text-destructive'
      aria-hidden='true'
    />
  )
}

function Dots() {
  return (
    <span
      aria-hidden='true'
      className='inline-flex items-end gap-[2px] text-signal'
    >
      <span className='dot-1 inline-block size-[3px] rounded-full bg-signal' />
      <span className='dot-2 inline-block size-[3px] rounded-full bg-signal' />
      <span className='dot-3 inline-block size-[3px] rounded-full bg-signal' />
    </span>
  )
}
