import { useState } from 'react'
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionEyebrow, SignalField, SignalFileInput } from '@/components/signal'
import { useCreateTranscription } from './api'

const MODELS = [
  { value: 'tiny', label: 'tiny', hint: 'mas rapido · menor precision' },
  { value: 'base', label: 'base', hint: 'equilibrado · recomendado para pruebas' },
  { value: 'small', label: 'small', hint: 'default · buena precision y velocidad' },
  { value: 'medium', label: 'medium', hint: 'mayor precision · mas lento' },
  { value: 'large-v3', label: 'large-v3', hint: 'maxima precision · requiere gpu' },
] as const

const LANGUAGES = [
  { value: 'auto', label: 'Detectar automaticamente' },
  { value: 'es', label: 'Espanol' },
  { value: 'en', label: 'Ingles' },
] as const

export function TranscriptionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [context, setContext] = useState('')
  const [model, setModel] = useState<string>('small')
  const [language, setLanguage] = useState<string>('es')
  const [beamSize, setBeamSize] = useState(5)
  const [vadFilter, setVadFilter] = useState(true)
  const mutation = useCreateTranscription()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      toast.error('Selecciona un archivo')
      return
    }
    const form = new FormData()
    form.append('file', file)
    form.append('context', context)
    form.append('model_name', model)
    form.append('language', language)
    form.append('beam_size', String(beamSize))
    form.append('vad_filter', String(vadFilter))
    mutation.mutate(form, {
      onSuccess: () => {
        toast.success('Transcripcion enviada a cola')
        setFile(null)
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : 'La transcripcion fallo',
        )
      },
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className='relative overflow-hidden rounded-xl border border-border/60 bg-card/40'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent'
      />
      <div className='space-y-6 p-5 sm:p-6 md:p-8'>
        <header className='flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-5'>
          <div className='space-y-2'>
            <SectionEyebrow>01 · nueva corrida</SectionEyebrow>
            <h2
              className='text-2xl leading-[1.05] tracking-[-0.02em] md:text-[2rem]'
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Nueva <em className='italic text-signal'>transcripcion</em>
            </h2>
          </div>
          <div className='flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
            <span className='inline-block size-1.5 rounded-full bg-signal signal-dot' />
            pipeline · ready
          </div>
        </header>

        <SignalField
          index={1}
          label='archivo de audio o video'
          required
          hint='mp3, wav, m4a o mp4 · se procesa en el servidor'
          error={!file && mutation.isError ? 'adjunta un archivo' : undefined}
        >
          <SignalFileInput file={file} onFileChange={setFile} />
        </SignalField>

        <div className='grid gap-6 md:grid-cols-2'>
          <SignalField
            index={2}
            label='modelo de whisper'
            hint='modelo mas pequeno = mas rapido y menos preciso'
          >
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className='h-11 border-border/60 bg-background/40 font-mono text-[12px] uppercase tracking-[0.18em] focus:border-signal focus:ring-0 focus:ring-offset-0'>
                <SelectValue placeholder='Selecciona un modelo' />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value} className='font-mono text-[12px]'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-foreground'>{m.label}</span>
                      <span className='text-[10px] text-muted-foreground'>
                        {m.hint}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SignalField>

          <SignalField index={3} label='idioma'>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className='h-11 border-border/60 bg-background/40 font-mono text-[12px] uppercase tracking-[0.18em] focus:border-signal focus:ring-0 focus:ring-offset-0'>
                <SelectValue placeholder='Selecciona idioma' />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem
                    key={l.value}
                    value={l.value}
                    className='font-mono text-[12px]'
                  >
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SignalField>
        </div>

        <SignalField
          index={4}
          label='contexto (prompt inicial)'
          hint='nombres propios, marcas, terminos tecnicos — se envia como prompt a whisper'
        >
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder='Ej: tema, nombres de personas, terminos medicos, marcas...'
            className='min-h-24 border-border/60 bg-background/40 font-mono text-[12px] leading-relaxed placeholder:text-muted-foreground/60 focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0'
          />
        </SignalField>

        <div className='grid gap-6 rounded-lg border border-border/60 bg-background/30 p-5 md:grid-cols-2'>
          <SignalField
            index={5}
            label='tamano de busqueda'
            hint={`beam = ${beamSize} · mayor = mas preciso, mas lento`}
          >
            <div className='space-y-3 pt-1'>
              <div className='flex h-11 items-center gap-2 rounded-md border border-border/60 bg-background/40 p-1'>
                <button
                  type='button'
                  onClick={() => setBeamSize((v) => Math.max(1, v - 1))}
                  className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border/60 text-muted-foreground transition-colors hover:border-signal/40 hover:bg-signal/10 hover:text-signal'
                  aria-label='Reducir beam'
                >
                  −
                </button>
                <div className='relative hidden flex-1 overflow-hidden md:block'>
                  <div
                    aria-hidden='true'
                    className='absolute inset-y-1/2 left-0 h-px -translate-y-1/2 bg-gradient-to-r from-signal/60 via-signal/30 to-transparent transition-all duration-500'
                    style={{ width: `${((beamSize - 1) / 9) * 100}%` }}
                  />
                  <div className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground'>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <span
                        key={n}
                        className={
                          n === beamSize
                            ? 'rounded-sm bg-signal/15 px-1.5 py-0.5 text-signal'
                            : 'opacity-50'
                        }
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:hidden'>
                  beam
                </span>
                <button
                  type='button'
                  onClick={() => setBeamSize((v) => Math.min(10, v + 1))}
                  className='inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border/60 text-muted-foreground transition-colors hover:border-signal/40 hover:bg-signal/10 hover:text-signal'
                  aria-label='Aumentar beam'
                >
                  +
                </button>
                <Input
                  type='number'
                  min={1}
                  max={10}
                  value={beamSize}
                  onChange={(e) => setBeamSize(Number(e.target.value))}
                  className='h-9 w-14 shrink-0 border-border/60 bg-background/60 text-center font-mono text-xs focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>
            </div>
          </SignalField>

          <SignalField
            index={6}
            label='filtro de actividad de voz'
            hint='omite silencios · recomendado para reuniones largas'
          >
            <label className='flex h-11 cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3'>
              <Checkbox
                checked={vadFilter}
                onCheckedChange={(v) => setVadFilter(v === true)}
                className='border-signal/50 data-[state=checked]:border-signal data-[state=checked]:bg-signal data-[state=checked]:text-ink'
              />
              <span className='flex flex-1 items-center justify-between'>
                <span className='text-sm text-foreground'>Deteccion de voz</span>
                <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                  {vadFilter ? 'on' : 'off'}
                </span>
              </span>
            </label>
          </SignalField>
        </div>
      </div>

      <footer className='flex flex-col gap-4 border-t border-border/60 bg-background/30 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:p-8'>
        <div className='flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <ShieldCheck className='size-3 text-signal' />
            jwt · argon2
          </span>
          <span className='flex items-center gap-1.5'>
            <Sparkles className='size-3 text-signal' />
            faster-whisper · ctranslate2
          </span>
        </div>
        <Button
          type='submit'
          disabled={mutation.isPending}
          className='group h-12 overflow-hidden rounded-md bg-foreground px-6 text-background hover:bg-foreground/90'
        >
          <span className='absolute inset-y-0 left-0 w-1 bg-signal transition-all duration-500 group-hover:w-2' />
          <span className='relative flex w-full items-center justify-between gap-3'>
            <span className='font-mono text-[11px] uppercase tracking-[0.28em]'>
              {mutation.isPending ? 'transcribiendo...' : 'transcribir audio'}
            </span>
            {mutation.isPending ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
            )}
          </span>
        </Button>
      </footer>
    </form>
  )
}
