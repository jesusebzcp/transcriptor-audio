import { FileAudio, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  SectionEyebrow,
  SignalChip,
} from '@/components/signal'
import { useDeleteTranscription, useTranscriptions } from './api'

export function TranscriptionHistory() {
  const { data, isLoading, error } = useTranscriptions()
  const del = useDeleteTranscription()

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 rounded-md border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='font-mono text-[10px] uppercase tracking-[0.22em]'>
          sincronizando historial...
        </span>
      </div>
    )
  }
  if (error) {
    return (
      <div className='rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
        No se pudo cargar el historial.
      </div>
    )
  }
  if (!data || data.length === 0) {
    return (
      <div className='relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-dashed border-border/60 bg-card/20 p-10 text-center'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 opacity-30'
          style={{
            backgroundImage:
              'radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--signal) 12%, transparent), transparent 70%)',
          }}
        />
        <FileAudio className='size-7 text-muted-foreground' />
        <div className='space-y-1'>
          <p
            className='text-lg tracking-tight'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Aun no hay <em className='italic text-signal'>transcripciones</em>
          </p>
          <p className='text-xs text-muted-foreground'>
            Sube tu primer audio o video y aparecera aqui.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul className='space-y-3'>
      {data.map((t, i) => (
        <li
          key={t.id}
          className='group relative overflow-hidden rounded-lg border border-border/60 bg-card/40 transition-colors hover:border-signal/40'
        >
          <span
            aria-hidden='true'
            className='absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-signal transition-transform duration-500 group-hover:scale-y-100'
          />
          <div className='space-y-3 p-5'>
            <header className='flex items-start justify-between gap-3'>
              <div className='min-w-0 flex-1 space-y-1.5'>
                <div className='flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                  <span className='text-signal'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className='text-muted-foreground/60'>·</span>
                  <span className='truncate'>{t.file_name}</span>
                </div>
                <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                  <span className='font-mono uppercase tracking-[0.18em]'>
                    {new Date(t.created_at).toLocaleString()}
                  </span>
                  <span className='text-muted-foreground/40'>·</span>
                  <SignalChip variant='muted' pulse={false}>
                    {t.model_name}
                  </SignalChip>
                  {t.language && (
                    <SignalChip variant='muted' pulse={false}>
                      {t.language}
                    </SignalChip>
                  )}
                </div>
              </div>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => del.mutate(t.id)}
                disabled={del.isPending}
                aria-label='Eliminar'
                className='text-muted-foreground hover:text-destructive'
              >
                <Trash2 />
              </Button>
            </header>
            <p className='whitespace-pre-wrap border-t border-border/40 pt-3 text-sm leading-relaxed text-foreground/85'>
              {t.text}
            </p>
          </div>
        </li>
      ))}
      <div className='flex items-center justify-between pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
        <SectionEyebrow>fin · {data.length} items</SectionEyebrow>
        <span>cache local sincronizado</span>
      </div>
    </ul>
  )
}
