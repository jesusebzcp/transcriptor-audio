import { useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
  type User,
} from './api'

export function UsersPage() {
  const { data, isLoading, error } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    createUser.mutate(
      {
        email,
        password,
        is_active: true,
        is_admin: isAdmin,
      },
      {
        onSuccess: () => {
          toast.success('Usuario invitado')
          setEmail('')
          setPassword('')
          setIsAdmin(false)
        },
        onError: () => toast.error('No se pudo crear el usuario'),
      },
    )
  }

  function toggleUser(user: User, field: 'is_active' | 'is_admin') {
    updateUser.mutate(
      { id: user.id, payload: { [field]: !user[field] } },
      { onError: () => toast.error('No se pudo actualizar el usuario') },
    )
  }

  function removeUser(user: User) {
    if (!confirm(`Eliminar usuario ${user.email}? Tambien se eliminaran sus transcripciones.`)) {
      return
    }
    deleteUser.mutate(user.id, {
      onSuccess: () => toast.success('Usuario eliminado'),
      onError: () => toast.error('No se pudo eliminar el usuario'),
    })
  }

  return (
    <div className='grid gap-6 p-4 md:p-6'>
      <Card>
        <CardHeader>
          <CardTitle>Invitar usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className='grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]'>
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='correo@ejemplo.com'
              required
            />
            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contrasena inicial'
              minLength={6}
              required
            />
            <label className='flex items-center gap-2 text-sm font-medium'>
              <input
                type='checkbox'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              Admin
            </label>
            <Button disabled={createUser.isPending}>
              {createUser.isPending && <Loader2 className='animate-spin' />}
              Invitar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Loader2 className='h-4 w-4 animate-spin' /> Cargando usuarios...
            </p>
          )}
          {error && <p className='text-sm text-destructive'>No se pudieron cargar los usuarios.</p>}
          {data && (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b text-left'>
                    <th className='py-2 pr-4'>Correo</th>
                    <th className='py-2 pr-4'>Estado</th>
                    <th className='py-2 pr-4'>Rol</th>
                    <th className='py-2 text-right'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((user) => (
                    <tr key={user.id} className='border-b last:border-0'>
                      <td className='py-3 pr-4'>{user.email}</td>
                      <td className='py-3 pr-4'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => toggleUser(user, 'is_active')}
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </Button>
                      </td>
                      <td className='py-3 pr-4'>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => toggleUser(user, 'is_admin')}
                        >
                          {user.is_admin ? 'Admin' : 'Usuario'}
                        </Button>
                      </td>
                      <td className='py-3 text-right'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeUser(user)}
                          aria-label='Eliminar usuario'
                        >
                          <Trash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
