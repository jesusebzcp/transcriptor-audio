import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useDeleteTranscription, useTranscriptions } from './api'
import { Loader2, Trash2 } from 'lucide-react'

export function TranscriptionHistory() {
  const { data, isLoading, error } = useTranscriptions()
  const del = useDeleteTranscription()

  if (isLoading) {
    return (
      <div className='flex items-center gap-2 p-4 text-sm text-muted-foreground'>
        <Loader2 className='h-4 w-4 animate-spin' /> Cargando historial...
      </div>
    )
  }
  if (error) {
    return (
      <p className='p-4 text-sm text-destructive'>No se pudo cargar el historial.</p>
    )
  }
  if (!data || data.length === 0) {
    return (
      <p className='p-4 text-sm text-muted-foreground'>
        Aun no hay transcripciones.
      </p>
    )
  }

  return (
    <div className='grid gap-3'>
      {data.map((t) => (
        <Card key={t.id}>
          <CardContent className='grid gap-2 p-4'>
            <div className='flex items-start justify-between gap-2'>
              <div>
                <p className='font-medium'>{t.file_name}</p>
                <p className='text-xs text-muted-foreground'>
                  {new Date(t.created_at).toLocaleString()} · {t.model_name}
                  {t.language ? ` · ${t.language}` : ''}
                </p>
              </div>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => del.mutate(t.id)}
                aria-label='Eliminar'
              >
                <Trash2 />
              </Button>
            </div>
            <p className='whitespace-pre-wrap text-sm'>{t.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
