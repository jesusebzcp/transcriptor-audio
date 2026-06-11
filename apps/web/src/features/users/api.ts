import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface User {
  id: number
  email: string
  is_active: boolean
  is_admin: boolean
}

export interface UserCreate {
  email: string
  password: string
  is_active: boolean
  is_admin: boolean
}

export interface UserUpdate {
  email?: string
  password?: string
  is_active?: boolean
  is_admin?: boolean
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get<User[]>('/api/v1/users')
      return res.data
    },
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UserCreate) => {
      const res = await api.post<User>('/api/v1/users', payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UserUpdate }) => {
      const res = await api.patch<User>(`/api/v1/users/${id}`, payload)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/v1/users/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}
