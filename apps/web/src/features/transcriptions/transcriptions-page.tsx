import { TranscriptionForm } from './transcription-form'
import { TranscriptionHistory } from './transcription-history'

export function TranscriptionsPage() {
  return (
    <div className='grid gap-6 p-4 md:p-6'>
      <TranscriptionForm />
      <section>
        <h2 className='mb-3 text-lg font-semibold'>Historial</h2>
        <TranscriptionHistory />
      </section>
    </div>
  )
}
