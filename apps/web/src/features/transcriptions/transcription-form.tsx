import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateTranscription } from './api'

const MODELS = ['tiny', 'base', 'small', 'medium', 'large-v3'] as const

export function TranscriptionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [context, setContext] = useState('')
  const [model, setModel] = useState<string>('small')
  const mutation = useCreateTranscription()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      toast.error('Select a file')
      return
    }
    const form = new FormData()
    form.append('file', file)
    form.append('context', context)
    form.append('model_name', model)
    mutation.mutate(form, {
      onSuccess: () => {
        toast.success('Transcription completed')
        setFile(null)
      },
      onError: (err) => {
        toast.error(
          err instanceof Error ? err.message : 'Transcription failed',
        )
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='grid gap-4'>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Audio or video</label>
            <input
              type='file'
              accept='.mp3,.wav,.m4a,.mp4,audio/*,video/*'
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className='text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>Model</label>
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
          </div>
          <div className='grid gap-2'>
            <label className='text-sm font-medium'>
              Context (keywords, names)
            </label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder='e.g. medical terms, brand names...'
            />
          </div>
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              <Upload />
            )}
            Transcribe
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
