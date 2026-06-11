import { Link } from '@tanstack/react-router'
import { ArrowRight, AudioLines, History, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  PageHeader,
  SectionEyebrow,
  SignalChip,
  StatTile,
} from '@/components/signal'
import { AudioWaveform } from '@/features/auth/components/audio-waveform'

export function Dashboard() {
  return (
    <>
      <Header />
      <Main className='space-y-10'>
        <section className='relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-transparent p-6 md:p-10'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-[0.5]'
            style={{
              backgroundImage:
                'radial-gradient(50% 60% at 85% 10%, color-mix(in oklch, var(--signal) 18%, transparent), transparent 70%), radial-gradient(40% 50% at 10% 90%, color-mix(in oklch, var(--sidebar-accent) 60%, transparent), transparent 70%)',
            }}
          />
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-[0.18]'
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in oklch, var(--signal) 18%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--signal) 18%, transparent) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage:
                'radial-gradient(70% 60% at 50% 50%, black 30%, transparent 75%)',
            }}
          />
          <div className='relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between'>
            <div className='space-y-4'>
              <SectionEyebrow>overview · runtime 0.4.1</SectionEyebrow>
              <h1
                className='text-balance text-[2.5rem] leading-[1.04] tracking-[-0.02em] md:text-[3rem]'
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Welcome back, <em className='italic text-signal'>operator</em>.
              </h1>
              <p className='max-w-xl text-sm leading-relaxed text-muted-foreground'>
                Drop a recording, choose a model, and the engine will return a
                clean, time-stamped transcript — ready to share or pipe into
                your pipeline.
              </p>
              <div className='flex flex-wrap items-center gap-2'>
                <Button
                  asChild
                  className='group h-11 rounded-md bg-foreground px-5 text-background hover:bg-foreground/90'
                >
                  <Link to='/transcriptions'>
                    <span className='font-mono text-[11px] uppercase tracking-[0.24em]'>
                      abrir consola
                    </span>
                    <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='h-11 rounded-md border-border/60 bg-background/40 font-mono text-[11px] uppercase tracking-[0.24em] hover:border-signal/50 hover:bg-background/60'
                >
                  <Link to='/users'>gestionar usuarios</Link>
                </Button>
              </div>
            </div>
            <div className='hidden shrink-0 md:block md:w-72 lg:w-80'>
              <div className='rounded-lg border border-border/60 bg-background/40 p-4'>
                <div className='mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                  <span>live · 48khz</span>
                  <SignalChip pulse>live</SignalChip>
                </div>
                <div className='h-16'>
                  <AudioWaveform />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='space-y-4'>
          <PageHeader
            eyebrow='02 · metricas'
            title='Estado del'
            highlight='sistema'
            description='Vista rapida del consumo de modelos, latencia promedio y trafico reciente.'
          />
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
            <StatTile
              label='modelo activo'
              value='small'
              hint='int8 · cpu · beam 5'
              tone='signal'
            />
            <StatTile
              label='transcripciones hoy'
              value='0'
              hint='ultima sync hace 1 min'
            />
            <StatTile
              label='latencia promedio'
              value='1.4×'
              hint='real-time factor'
            />
            <StatTile
              label='usuarios activos'
              value='1'
              hint='sesiones autenticadas'
            />
          </div>
        </section>

        <section className='space-y-4'>
          <PageHeader
            eyebrow='03 · accesos rapidos'
            title='Ir a'
            highlight='trabajar'
          />
          <div className='grid gap-3 md:grid-cols-3'>
            <QuickAction
              to='/transcriptions'
              icon={AudioLines}
              title='Transcribir audio'
              description='Sube un archivo y elige un modelo de Whisper.'
              tag='A · workflow'
            />
            <QuickAction
              to='/transcriptions'
              icon={History}
              title='Ver historial'
              description='Consulta resultados previos y vuelve a descargar.'
              tag='B · archive'
            />
            <QuickAction
              to='/users'
              icon={Users}
              title='Invitar usuarios'
              description='Solo administradores pueden dar de alta cuentas.'
              tag='C · admin'
            />
          </div>
        </section>
      </Main>
    </>
  )
}

type QuickActionProps = {
  to: string
  icon: React.ElementType
  title: string
  description: string
  tag: string
}

function QuickAction({ to, icon: Icon, title, description, tag }: QuickActionProps) {
  return (
    <Link
      to={to}
      className='group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-border/60 bg-card/40 p-5 transition-colors hover:border-signal/50 hover:bg-card/70'
    >
      <span
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100'
      />
      <div className='flex items-center justify-between'>
        <div className='flex size-9 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-colors group-hover:border-signal/40 group-hover:bg-signal/10 group-hover:text-signal'>
          <Icon className='size-4' />
        </div>
        <span className='font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
          {tag}
        </span>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center gap-1 text-sm font-medium text-foreground'>
          {title}
          <ArrowRight className='size-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-signal' />
        </div>
        <p className='text-xs leading-relaxed text-muted-foreground'>{description}</p>
      </div>
      <div className='mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70'>
        <Sparkles className='size-3 text-signal' />
        action · ready
      </div>
    </Link>
  )
}
