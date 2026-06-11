import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

type BrandMarkProps = SVGProps<SVGSVGElement> & {
  withWordmark?: boolean
}

export function BrandMark({ className, withWordmark = true, ...props }: BrandMarkProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        viewBox='0 0 32 32'
        xmlns='http://www.w3.org/2000/svg'
        height='28'
        width='28'
        fill='none'
        aria-hidden='true'
        {...props}
      >
        <rect
          x='0.75'
          y='0.75'
          width='30.5'
          height='30.5'
          rx='8.25'
          stroke='currentColor'
          strokeOpacity='0.18'
          strokeWidth='1.5'
        />
        <g stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
          <line x1='8' y1='16' x2='8' y2='16' />
          <line x1='12' y1='11' x2='12' y2='21' />
          <line x1='16' y1='7' x2='16' y2='25' className='text-signal' stroke='var(--signal)' />
          <line x1='20' y1='12' x2='20' y2='20' />
          <line x1='24' y1='14' x2='24' y2='18' />
        </g>
      </svg>
      {withWordmark && (
        <span className='font-mono text-[0.95rem] tracking-[-0.01em] text-foreground'>
          <span className='font-semibold'>coding</span>
          <span className='text-muted-foreground'>/</span>
          <span className='font-semibold italic text-signal' style={{ fontFamily: 'var(--font-serif)' }}>
            power
          </span>
        </span>
      )}
    </div>
  )
}
