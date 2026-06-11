import * as React from 'react'
import { FileAudio, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type SignalFileInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange' | 'value'
> & {
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export function SignalFileInput({
  file,
  onFileChange,
  accept = '.mp3,.wav,.m4a,.mp4,audio/*,video/*',
  className,
  disabled,
  ...props
}: SignalFileInputProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-md border border-dashed border-border/80 bg-background/40 transition-colors hover:border-signal/60',
        file && 'border-signal/50 bg-signal/5',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
    >
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        disabled={disabled}
        className='absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed'
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        {...props}
      />
      <div className='pointer-events-none flex items-center gap-4 p-4'>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground transition-colors',
            file && 'border-signal/40 bg-signal/10 text-signal'
          )}
        >
          {file ? <FileAudio className='size-5' /> : <Upload className='size-5' />}
        </div>
        <div className='min-w-0 flex-1'>
          {file ? (
            <>
              <div className='truncate text-sm font-medium text-foreground'>
                {file.name}
              </div>
              <div className='mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                {formatBytes(file.size)} · {file.type || 'audio'}
              </div>
            </>
          ) : (
            <>
              <div className='text-sm font-medium text-foreground'>
                Suelta el archivo o haz click para subirlo
              </div>
              <div className='mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                mp3 · wav · m4a · mp4 — max recomendado 200mb
              </div>
            </>
          )}
        </div>
        {file && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            className='z-20 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            aria-label='Quitar archivo'
          >
            <X className='size-4' />
          </button>
        )}
      </div>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-700 group-focus-within:w-full'
      />
    </div>
  )
}
