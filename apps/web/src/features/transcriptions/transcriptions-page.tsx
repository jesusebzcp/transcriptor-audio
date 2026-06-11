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
          description='Carga un archivo, configura el modelo y el worker lo procesara en segundo plano aunque cierres la pagina.'
        />
        <TranscriptionForm />
        <section className='space-y-4'>
          <PageHeader
            eyebrow='02 · procesos'
            title='Cola de'
            highlight='trabajo'
            description='Revisa el estado de tus procesos y descarga el resultado cuando esten listos.'
          />
          <TranscriptionHistory />
        </section>
      </Main>
    </>
  )
}
