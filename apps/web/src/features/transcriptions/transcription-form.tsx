import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateTranscription } from './api'

const MODELS = ['tiny', 'base', 'small', 'medium', 'large-v3'] as const
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
        toast.success('Transcripcion completada')
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
    <Card>
      <CardHeader>
        <CardTitle>Nueva transcripcion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Audio o video</label>
            <input
              type='file'
              accept='.mp3,.wav,.m4a,.mp4,audio/*,video/*'
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className='text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Modelo</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className='rounded-md border bg-background px-3 py-2 text-sm'
            >
              {MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <p className='text-xs text-muted-foreground'>
              Usa small para velocidad; medium o large-v3 para mayor precision.
            </p>
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='rounded-md border bg-background px-3 py-2 text-sm'
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>
              Contexto (palabras clave, nombres, vocabulario)
            </label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder='Ej: tema, nombres de personas, terminos medicos, marcas...'
            />
            <p className='text-xs text-muted-foreground'>
              Agrega nombres propios, marcas, siglas y terminos tecnicos. Se
              envia a faster-whisper como prompt inicial.
            </p>
          </div>
          <div className='grid gap-4 rounded-lg border p-3 sm:grid-cols-2'>
            <div className='grid gap-2'>
              <label className='text-sm font-medium'>Tamano de busqueda</label>
              <input
                type='number'
                min={1}
                max={10}
                value={beamSize}
                onChange={(e) => setBeamSize(Number(e.target.value))}
                className='rounded-md border bg-background px-3 py-2 text-sm'
              />
              <p className='text-xs text-muted-foreground'>
                Un valor mayor puede mejorar precision, pero corre mas lento.
              </p>
            </div>
            <label className='flex items-center gap-2 text-sm font-medium'>
              <input
                type='checkbox'
                checked={vadFilter}
                onChange={(e) => setVadFilter(e.target.checked)}
              />
              Deteccion de voz
            </label>
          </div>
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              <Upload />
            )}
            Transcribir
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
