import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Transcription {
  id: number
  file_name: string
  language: string | null
  duration: number | null
  model_name: string
  context: string | null
  text: string
  created_at: string
}

export function useTranscriptions() {
  return useQuery({
    queryKey: ['transcriptions'],
    queryFn: async () => {
      const res = await api.get<Transcription[]>('/api/v1/transcriptions')
      return res.data
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
