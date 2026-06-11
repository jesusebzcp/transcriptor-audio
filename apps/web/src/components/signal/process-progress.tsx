import { cn } from '@/lib/utils'
import type { StatusVariant } from './status-badge'

type ProcessProgressProps = {
  status: StatusVariant
  className?: string
}

export function ProcessProgress({ status, className }: ProcessProgressProps) {
  if (status === 'completed') {
    return (
      <div
        aria-hidden='true'
        className={cn(
          'relative h-px w-full overflow-hidden bg-emerald-400/15',
          className
        )}
      >
        <span className='absolute inset-y-0 left-0 w-full bg-emerald-400/70' />
      </div>
    )
  }
  if (status === 'failed') {
    return (
      <div
        aria-hidden='true'
        className={cn(
          'relative h-px w-full overflow-hidden bg-destructive/20',
          className
        )}
      >
        <span className='absolute inset-y-0 left-0 w-full bg-destructive/60' />
      </div>
    )
  }
  if (status === 'queued') {
    return (
      <div
        aria-hidden='true'
        className={cn(
          'relative h-px w-full overflow-hidden bg-sky-400/15',
          className
        )}
      >
        <span className='queue-dot absolute inset-y-0 left-0 block h-full w-1/3 rounded-full bg-sky-400/60' />
      </div>
    )
  }
  // processing
  return (
    <div
      aria-hidden='true'
      className={cn(
        'relative h-px w-full overflow-hidden bg-signal/15',
        className
      )}
    >
      <span className='progress-slide absolute inset-y-0 block h-full w-1/4 rounded-full bg-signal/80' />
    </div>
  )
}
