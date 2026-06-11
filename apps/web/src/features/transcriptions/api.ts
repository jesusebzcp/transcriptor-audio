import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Transcription {
  id: number
  file_name: string
  language: string | null
  duration: number | null
  model_name: string
  beam_size: number
  vad_filter: boolean
  status: 'queued' | 'processing' | 'completed' | 'failed'
  error_message: string | null
  context: string | null
  text: string
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export function useTranscriptions() {
  return useQuery({
    queryKey: ['transcriptions'],
    queryFn: async () => {
      const res = await api.get<Transcription[]>('/api/v1/transcriptions')
      return res.data
    },
    refetchInterval: (query) => {
      const items = query.state.data
      return items?.some((t) => ['queued', 'processing'].includes(t.status))
        ? 3000
        : false
    },
  })
}

export function useCreateTranscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: FormData) => {
      const res = await api.post<Transcription>(
        '/api/v1/transcriptions',
        form,
      )
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transcriptions'] })
    },
  })
}

export async function downloadTranscription(id: number, fileName: string) {
  const res = await api.get(`/api/v1/transcriptions/${id}/download`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName.replace(/\.[^/.]+$/, '') || 'transcripcion'}.txt`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export function useDeleteTranscription() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/transcriptions/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transcriptions'] })
    },
  })
}
