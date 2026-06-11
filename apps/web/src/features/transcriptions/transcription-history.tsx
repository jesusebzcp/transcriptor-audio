import { Download, FileAudio, Loader2, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SectionEyebrow, SignalChip } from '@/components/signal'
import { ProcessProgress } from '@/components/signal/process-progress'
import { StatusBadge } from '@/components/signal/status-badge'
import { cn } from '@/lib/utils'
import {
  downloadTranscription,
  useDeleteTranscription,
  useTranscriptions,
  type Transcription,
} from './api'

export function TranscriptionHistory() {
  const { data, isLoading, error } = useTranscriptions()
  const del = useDeleteTranscription()

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 rounded-md border border-dashed border-border/60 bg-card/30 p-4 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span className='font-mono text-[10px] uppercase tracking-[0.22em]'>
          sincronizando procesos...
        </span>
      </div>
    )
  }
  if (error) {
    return (
      <div className='rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
        No se pudieron cargar los procesos.
      </div>
    )
  }
  if (!data || data.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='space-y-4'>
      <MobileProcessList items={data} onDelete={(id) => del.mutate(id)} />
      <DesktopProcessTable items={data} onDelete={(id) => del.mutate(id)} />
      <div className='flex flex-wrap items-center justify-between gap-2 pt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
        <SectionEyebrow>fin · {data.length} procesos</SectionEyebrow>
        <span className='flex items-center gap-1.5'>
          <span className='inline-block size-1.5 rounded-full bg-signal signal-dot' />
          sincronizacion automatica
        </span>
      </div>
    </div>
  )
}

function EmptyState() {
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
          Aun no hay <em className='italic text-signal'>procesos</em>
        </p>
        <p className='text-xs text-muted-foreground'>
          Sube tu primer audio o video y seguira corriendo aunque cierres la
          pagina.
        </p>
      </div>
    </div>
  )
}

/* ============================== Mobile ============================== */

function MobileProcessList({
  items,
  onDelete,
}: {
  items: Transcription[]
  onDelete: (id: number) => void
}) {
  return (
    <ul className='space-y-3 md:hidden'>
      {items.map((t) => (
        <li
          key={t.id}
          className={cn(
            'group relative overflow-hidden rounded-lg border bg-card/40 transition-colors',
            statusBorder(t.status),
            t.status === 'processing' && 'bg-signal/[0.04]'
          )}
        >
          <span
            aria-hidden='true'
            className={cn(
              'absolute inset-y-0 left-0 w-1 transition-transform duration-500',
              statusBar(t.status),
              t.status === 'processing' ? 'scale-y-100' : 'scale-y-0'
            )}
          />
          <div className='space-y-3 p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='min-w-0 flex-1 space-y-1'>
                <p
                  className={cn(
                    'truncate text-sm font-medium',
                    t.status === 'failed' && 'text-destructive'
                  )}
                >
                  {t.file_name}
                </p>
                <p className='font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground'>
                  {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={t.status} />
            </div>
            <div className='flex flex-wrap gap-2 text-xs text-muted-foreground'>
              <SignalChip variant='muted' pulse={false}>
                {t.model_name}
              </SignalChip>
              {t.language && (
                <SignalChip variant='muted' pulse={false}>
                  {t.language}
                </SignalChip>
              )}
              <SignalChip variant='muted' pulse={false}>
                beam {t.beam_size}
              </SignalChip>
              <SignalChip variant='muted' pulse={false}>
                <Clock className='h-3 w-3' />
                {formatDuration(t.duration)}
              </SignalChip>
              <SignalChip variant='muted' pulse={t.status === 'processing'}>
                {t.status === 'processing' && (
                  <Loader2 className='h-3 w-3 animate-spin' />
                )}
                {formatProcessingTime(t.processing_time)}
              </SignalChip>
            </div>
            {t.error_message && (
              <p className='text-xs text-destructive'>{t.error_message}</p>
            )}
            {t.status === 'completed' && t.text && (
              <p className='line-clamp-3 border-t border-border/40 pt-3 text-sm text-foreground/80'>
                {t.text}
              </p>
            )}
            <Actions item={t} onDelete={onDelete} className='justify-end' />
          </div>
          <ProcessProgress status={t.status} />
        </li>
      ))}
    </ul>
  )
}

/* ============================== Desktop ============================== */

function DesktopProcessTable({
  items,
  onDelete,
}: {
  items: Transcription[]
  onDelete: (id: number) => void
}) {
  return (
    <div className='hidden overflow-x-auto rounded-xl border border-border/60 bg-card/30 md:block'>
      <table className='w-full min-w-[900px] text-sm'>
        <thead>
          <tr className='border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            <th className='px-4 py-3'>Archivo</th>
            <th className='px-4 py-3'>Estado</th>
            <th className='px-4 py-3'>Modelo</th>
            <th className='px-4 py-3'>Duracion</th>
            <th className='px-4 py-3'>Proceso</th>
            <th className='px-4 py-3'>Fecha</th>
            <th className='px-4 py-3 text-right'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr
              key={t.id}
              data-status={t.status}
              className={cn(
                'group relative border-b border-border/40 transition-colors last:border-0',
                t.status === 'processing' &&
                  'bg-signal/[0.05] hover:bg-signal/[0.08]',
                t.status === 'queued' && 'bg-sky-400/[0.04] hover:bg-sky-400/[0.08]',
                t.status === 'failed' && 'bg-destructive/[0.04] hover:bg-destructive/[0.08]'
              )}
            >
              <td className='relative max-w-[260px] px-4 py-4'>
                <span
                  aria-hidden='true'
                  className={cn(
                    'absolute inset-y-0 left-0 w-1 transition-all duration-500',
                    statusBar(t.status),
                    t.status === 'processing'
                      ? 'scale-y-100 row-glow'
                      : 'scale-y-0 group-hover:scale-y-100'
                  )}
                />
                <p
                  className={cn(
                    'truncate pl-2 font-medium',
                    t.status === 'failed' && 'text-destructive'
                  )}
                >
                  {t.file_name}
                </p>
                {t.error_message && (
                  <p className='mt-1 truncate pl-2 text-xs text-destructive'>
                    {t.error_message}
                  </p>
                )}
              </td>
              <td className='px-4 py-4'>
                <StatusBadge status={t.status} />
              </td>
              <td className='px-4 py-4'>
                <div className='flex flex-wrap gap-1.5'>
                  <SignalChip variant='muted' pulse={false}>
                    {t.model_name}
                  </SignalChip>
                  {t.language && (
                    <SignalChip variant='muted' pulse={false}>
                      {t.language}
                    </SignalChip>
                  )}
                  <SignalChip variant='muted' pulse={false}>
                    beam {t.beam_size}
                  </SignalChip>
                </div>
              </td>
              <td className='px-4 py-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
                {formatDuration(t.duration)}
              </td>
              <td className='px-4 py-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
                <span className={cn(t.status === 'processing' && 'inline-flex items-center gap-1 text-signal')}>
                  {t.status === 'processing' && (
                    <Loader2 className='h-3 w-3 animate-spin' />
                  )}
                  {formatProcessingTime(t.processing_time)}
                </span>
              </td>
              <td className='px-4 py-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
                {new Date(t.created_at).toLocaleString()}
              </td>
              <td className='px-4 py-4'>
                <Actions item={t} onDelete={onDelete} className='justify-end' />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ============================== Helpers ============================== */

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatProcessingTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

function statusBar(status: Transcription['status']) {
  switch (status) {
    case 'processing':
      return 'bg-signal'
    case 'queued':
      return 'bg-sky-400'
    case 'completed':
      return 'bg-emerald-400'
    case 'failed':
      return 'bg-destructive'
  }
}

function statusBorder(status: Transcription['status']) {
  switch (status) {
    case 'processing':
      return 'border-signal/40'
    case 'queued':
      return 'border-sky-400/30'
    case 'completed':
      return 'border-emerald-400/25'
    case 'failed':
      return 'border-destructive/40'
  }
}

/* ============================== Actions ============================== */

function Actions({
  item,
  onDelete,
  className,
}: {
  item: Transcription
  onDelete: (id: number) => void
  className?: string
}) {
  async function handleDownload() {
    try {
      await downloadTranscription(item.id, item.file_name)
    } catch {
      toast.error('No se pudo descargar la transcripcion')
    }
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={handleDownload}
        disabled={item.status !== 'completed'}
        className='font-mono text-[10px] uppercase tracking-[0.22em] disabled:opacity-40'
      >
        <Download />
        Descargar
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => onDelete(item.id)}
        aria-label='Eliminar'
        className='text-muted-foreground hover:text-destructive'
      >
        <Trash2 />
      </Button>
    </div>
  )
}
