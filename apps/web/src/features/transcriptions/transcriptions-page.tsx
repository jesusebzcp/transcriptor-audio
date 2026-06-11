import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PageHeader } from '@/components/signal'
import { TranscriptionForm } from './transcription-form'
import { TranscriptionHistory } from './transcription-history'

export function TranscriptionsPage() {
  return (
    <>
      <Header />
      <Main className='space-y-8'>
        <PageHeader
          eyebrow='01 · workspace'
          title='Transcripciones'
          highlight='whisper'
          description='Carga un archivo, configura el modelo y guarda el resultado. Todo se procesa en el backend con faster-whisper.'
        />
        <TranscriptionForm />
        <section className='space-y-4'>
          <PageHeader
            eyebrow='02 · archivo'
            title='Historial de'
            highlight='corridas'
            description='Tus transcripciones mas recientes, guardadas y disponibles para descarga.'
          />
          <TranscriptionHistory />
        </section>
      </Main>
    </>
  )
}
