import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SignalChip } from '@/components/signal'

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-2 p-3 sm:gap-4 sm:p-4',
          offset > 10 &&
            fixed &&
            'after:absolute after:inset-0 after:-z-10 after:bg-background/70 after:backdrop-blur-lg'
        )}
      >
        <SidebarTrigger
          variant='outline'
          className='size-9 max-md:scale-110 sm:size-9'
        />
        <Separator orientation='vertical' className='h-6' />

        <div className='flex items-center gap-2'>
          <SignalChip pulse>online</SignalChip>
          <span
            className='hidden font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:inline'
            suppressHydrationWarning
          >
            {now.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            utc
          </span>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2 sm:gap-3'>
          <div className='hidden h-10 items-center gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:flex'>
            <Search className='size-3.5' />
            <span>buscar transcripciones</span>
            <kbd className='ms-2 rounded border border-border/60 bg-background/80 px-1 text-[9px]'>
              /
            </kbd>
          </div>
          <button
            type='button'
            aria-label='Buscar'
            className='inline-flex size-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-signal/40 hover:text-signal md:hidden'
          >
            <Search className='size-4' />
          </button>
          {children}
        </div>
      </div>
    </header>
  )
}
