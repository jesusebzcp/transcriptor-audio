import { createFileRoute } from '@tanstack/react-router'
import { TranscriptionsPage } from '@/features/transcriptions/transcriptions-page'

export const Route = createFileRoute('/_authenticated/transcriptions/')({
  component: TranscriptionsPage,
})
