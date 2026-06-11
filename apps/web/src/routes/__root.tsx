import { type QueryClient } from '@tanstack/react-query'
import { Link, createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, RefreshCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { SignalChip } from '@/components/signal'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster duration={5000} />
      </>
    )
  },
  notFoundComponent: () => (
    <div className='relative grid min-h-svh place-items-center overflow-hidden bg-background px-5'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-50'
        style={{
          backgroundImage:
            'radial-gradient(45% 55% at 50% 30%, color-mix(in oklch, var(--signal) 14%, transparent), transparent 70%)',
        }}
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-[0.18]'
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in oklch, var(--signal) 22%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--signal) 22%, transparent) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage:
            'radial-gradient(70% 60% at 50% 50%, black 30%, transparent 80%)',
        }}
      />
      <div className='relative w-full max-w-md space-y-6 text-center'>
        <div className='flex justify-center'>
          <SignalChip pulse variant='muted'>
            404 · ruta no encontrada
          </SignalChip>
        </div>
        <div className='space-y-3'>
          <p
            className='text-[5rem] leading-none tracking-[-0.04em] text-signal sm:text-[7rem]'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            404
          </p>
          <h1
            className='text-2xl leading-tight tracking-tight sm:text-3xl'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <em className='italic text-signal'>Sin</em> senal en esta ruta
          </h1>
          <p className='mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground'>
            La pagina que buscas no existe o se movio. Vuelve al panel para
            seguir trabajando.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center gap-2 sm:flex-row'>
          <Button
            asChild
            className='group h-11 w-full overflow-hidden rounded-md bg-foreground px-5 text-background hover:bg-foreground/90 sm:w-auto'
          >
            <Link to='/'>
              <span className='absolute inset-y-0 left-0 w-1 bg-signal transition-all duration-500 group-hover:w-2' />
              <span className='relative flex w-full items-center justify-center gap-2'>
                <span className='font-mono text-[11px] uppercase tracking-[0.24em]'>
                  volver al panel
                </span>
                <ArrowRight className='size-3.5 transition-transform duration-300 group-hover:translate-x-0.5' />
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            className='h-11 w-full rounded-md border-border/60 px-5 font-mono text-[11px] uppercase tracking-[0.24em] hover:border-signal/50 sm:w-auto'
          >
            <Link to='/transcriptions'>
              <Search className='size-3.5' />
              ver transcripciones
            </Link>
          </Button>
        </div>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className='relative grid min-h-svh place-items-center overflow-hidden bg-background px-5'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-50'
        style={{
          backgroundImage:
            'radial-gradient(45% 55% at 50% 30%, color-mix(in oklch, var(--destructive) 18%, transparent), transparent 70%)',
        }}
      />
      <div className='relative w-full max-w-md space-y-6 text-center'>
        <div className='flex justify-center'>
          <span className='inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-destructive'>
            <AlertTriangle className='size-3' />
            error · runtime
          </span>
        </div>
        <div className='space-y-3'>
          <p
            className='text-[5rem] leading-none tracking-[-0.04em] text-destructive sm:text-[7rem]'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            500
          </p>
          <h1
            className='text-2xl leading-tight tracking-tight sm:text-3xl'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            El motor se <em className='italic text-destructive'>detuvo</em>
          </h1>
          <p className='mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground'>
            Algo salio mal en el servidor. Refresca la pagina o intenta de
            nuevo mas tarde.
          </p>
        </div>
        <div className='flex flex-col items-center justify-center gap-2 sm:flex-row'>
          <Button
            onClick={() => window.location.reload()}
            className='group h-11 w-full overflow-hidden rounded-md bg-foreground px-5 text-background hover:bg-foreground/90 sm:w-auto'
          >
            <span className='absolute inset-y-0 left-0 w-1 bg-destructive transition-all duration-500 group-hover:w-2' />
            <span className='relative flex w-full items-center justify-center gap-2'>
              <RefreshCcw className='size-3.5' />
              <span className='font-mono text-[11px] uppercase tracking-[0.24em]'>
                refrescar
              </span>
            </span>
          </Button>
          <Button
            asChild
            variant='outline'
            className='h-11 w-full rounded-md border-border/60 px-5 font-mono text-[11px] uppercase tracking-[0.24em] hover:border-signal/50 sm:w-auto'
          >
            <Link to='/sign-in'>ir al login</Link>
          </Button>
        </div>
      </div>
    </div>
  ),
})
