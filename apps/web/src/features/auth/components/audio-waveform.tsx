import { cn } from '@/lib/utils'

type AudioWaveformProps = {
  bars?: number
  className?: string
  barClassName?: string
  active?: boolean
}

const DEFAULT_HEIGHTS = [
  0.34, 0.58, 0.78, 0.46, 0.92, 0.64, 0.38, 0.82, 0.5, 0.7, 0.28, 0.6, 0.88, 0.42,
  0.74, 0.52, 0.9, 0.36, 0.66, 0.48, 0.8, 0.3, 0.72, 0.56, 0.94, 0.4, 0.68, 0.84,
  0.46, 0.6, 0.32, 0.78, 0.54, 0.88, 0.42, 0.7, 0.36, 0.62, 0.5, 0.86, 0.28, 0.74,
  0.58, 0.4, 0.82, 0.5, 0.68, 0.94, 0.32, 0.6, 0.76, 0.44, 0.88, 0.56, 0.7, 0.38,
  0.66, 0.84, 0.46, 0.6, 0.92, 0.34,
]

export function AudioWaveform({
  bars = 48,
  className,
  barClassName,
  active = true,
}: AudioWaveformProps) {
  const items = Array.from({ length: bars }, (_, i) => {
    const base = DEFAULT_HEIGHTS[i % DEFAULT_HEIGHTS.length] ?? 0.5
    const variance = ((i * 37) % 13) / 100
    return Math.max(0.2, Math.min(0.98, base + variance - 0.06))
  })

  return (
    <div
      role='img'
      aria-label='Visualizacion de onda de audio'
      className={cn(
        'flex h-full w-full items-center justify-between gap-[3px]',
        className
      )}
    >
      {items.map((height, i) => {
        const delay = `${(i * 73) % 1600}ms`
        const duration = `${1300 + ((i * 47) % 700)}ms`
        return (
          <span
            key={i}
            className={cn(
              'signal-bar block w-[3px] flex-1 rounded-full bg-signal/80',
              !active && '!animate-none opacity-30',
              barClassName
            )}
            style={{
              height: `${height * 100}%`,
              animationDelay: delay,
              animationDuration: duration,
            }}
          />
        )
      })}
    </div>
  )
}
