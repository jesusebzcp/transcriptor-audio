import { useMemo, useState } from 'react'
import {
  ArrowRight,
  KeyRound,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users as UsersIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import {
  PageHeader,
  SectionEyebrow,
  SignalChip,
  StatTile,
} from '@/components/signal'
import { cn, getDisplayNameInitials } from '@/lib/utils'
import { PasswordInput } from '@/components/password-input'
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
  type User,
} from './api'

type DialogMode =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; user: User }

const inviteSchema = z.object({
  email: z.email('Ingresa un correo valido.'),
  password: z.string().min(6, 'Minimo 6 caracteres.'),
  is_admin: z.boolean(),
})

type InviteFormValues = z.infer<typeof inviteSchema>

export function UsersPage() {
  const { data, isLoading, error } = useUsers()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const [dialog, setDialog] = useState<DialogMode>({ kind: 'closed' })
  const [toDelete, setToDelete] = useState<User | null>(null)
  const [query, setQuery] = useState('')
  const [showInactive, setShowInactive] = useState(true)

  const users = useMemo(() => data ?? [], [data])
  const stats = useMemo(() => {
    const total = users.length
    const active = users.filter((u) => u.is_active).length
    const admins = users.filter((u) => u.is_admin).length
    return { total, active, admins, inactive: total - active }
  }, [users])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (!showInactive && !u.is_active) return false
      if (!q) return true
      return u.email.toLowerCase().includes(q)
    })
  }, [users, query, showInactive])

  function openCreate() {
    setDialog({ kind: 'create' })
  }
  function openEdit(user: User) {
    setDialog({ kind: 'edit', user })
  }
  function closeDialog() {
    setDialog({ kind: 'closed' })
  }

  function toggleFlag(user: User, field: 'is_active' | 'is_admin') {
    updateUser.mutate(
      { id: user.id, payload: { [field]: !user[field] } },
      {
        onSuccess: () =>
          toast.success(
            field === 'is_active'
              ? user.is_active
                ? 'Usuario desactivado'
                : 'Usuario activado'
              : user.is_admin
                ? 'Rol revocado'
                : 'Usuario promovido a admin',
          ),
        onError: () => toast.error('No se pudo actualizar el usuario'),
      },
    )
  }

  function confirmDelete() {
    if (!toDelete) return
    deleteUser.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success('Usuario eliminado')
        setToDelete(null)
      },
      onError: () => toast.error('No se pudo eliminar el usuario'),
    })
  }

  return (
    <>
      <Header />
      <Main className='space-y-8'>
        <PageHeader
          eyebrow='01 · directorio'
          title='Usuarios'
          highlight='invitados'
          description='Personas con acceso a la consola. Solo los administradores pueden invitar, editar o revocar cuentas.'
          actions={
            <Button
              onClick={openCreate}
              className='group h-11 w-full overflow-hidden rounded-md bg-foreground px-4 text-background hover:bg-foreground/90 sm:w-auto sm:px-5'
            >
              <span className='absolute inset-y-0 left-0 w-1 bg-signal transition-all duration-500 group-hover:w-2' />
              <span className='relative flex w-full items-center justify-center gap-2 sm:justify-start'>
                <UserPlus className='size-4' />
                <span className='font-mono text-[11px] uppercase tracking-[0.24em]'>
                  <span className='sm:hidden'>invitar</span>
                  <span className='hidden sm:inline'>invitar usuario</span>
                </span>
                <ArrowRight className='size-3.5 transition-transform duration-300 group-hover:translate-x-0.5' />
              </span>
            </Button>
          }
        />

        <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          <StatTile
            label='total'
            value={stats.total}
            hint='cuentas registradas'
            tone='signal'
          />
          <StatTile
            label='activos'
            value={stats.active}
            hint={stats.inactive ? `${stats.inactive} inactivos` : 'todos activos'}
          />
          <StatTile
            label='administradores'
            value={stats.admins}
            hint='acceso completo'
          />
          <StatTile
            label='nivel de acceso'
            value='admin'
            hint='rutas protegidas por jwt'
          />
        </section>

        <section className='relative overflow-hidden rounded-xl border border-border/60 bg-card/30'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent'
          />
          <header className='flex flex-col gap-4 border-b border-border/60 p-4 sm:p-5 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex size-9 items-center justify-center rounded-md border border-border/60 bg-background/40 text-muted-foreground'>
                <UsersIcon className='size-4' />
              </div>
              <div className='space-y-1'>
                <SectionEyebrow>02 · directorio</SectionEyebrow>
                <h2
                  className='text-lg leading-none tracking-tight'
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Listado de <em className='italic text-signal'>cuentas</em>
                </h2>
              </div>
            </div>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto md:flex-nowrap'>
              <div className='flex h-10 w-full items-center gap-2 rounded-md border border-border/60 bg-background/40 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:w-64'>
                <Search className='size-3.5 shrink-0' />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='buscar por correo...'
                  className='w-full min-w-0 bg-transparent text-xs normal-case tracking-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none'
                />
              </div>
              <label className='flex h-10 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-md border border-border/60 bg-background/40 px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:justify-start'>
                <span className='whitespace-nowrap'>mostrar inactivos</span>
                <Switch
                  checked={showInactive}
                  onCheckedChange={setShowInactive}
                  className='data-[state=checked]:bg-signal'
                />
              </label>
            </div>
          </header>

          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
                  <th className='px-4 py-3 font-normal sm:px-5'>cuenta</th>
                  <th className='px-4 py-3 font-normal sm:px-5'>rol</th>
                  <th className='hidden px-4 py-3 font-normal sm:table-cell sm:px-5'>
                    estado
                  </th>
                  <th className='hidden px-4 py-3 font-normal lg:table-cell lg:px-5'>
                    id
                  </th>
                  <th className='px-4 py-3 text-right font-normal sm:px-5'>
                    acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className='px-4 py-10 text-center text-muted-foreground sm:px-5'>
                      <span className='inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]'>
                        <Loader2 className='size-3.5 animate-spin' />
                        cargando directorio...
                      </span>
                    </td>
                  </tr>
                )}
                {error && !isLoading && (
                  <tr>
                    <td colSpan={5} className='px-4 py-6 text-sm text-destructive sm:px-5'>
                      No se pudieron cargar los usuarios.
                    </td>
                  </tr>
                )}
                {!isLoading && !error && filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className='px-4 py-12 sm:px-5'>
                      <EmptyState
                        title={query ? 'Sin resultados' : 'Directorio vacio'}
                        description={
                          query
                            ? `No hay cuentas que coincidan con "${query}".`
                            : 'Invita a la primera persona para empezar.'
                        }
                        action={
                          !query ? (
                            <Button
                              onClick={openCreate}
                              variant='outline'
                              className='h-9 rounded-md border-border/60 font-mono text-[10px] uppercase tracking-[0.24em] hover:border-signal/50'
                            >
                              <UserPlus className='size-3.5' />
                              invitar
                            </Button>
                          ) : null
                        }
                      />
                    </td>
                  </tr>
                )}
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className='group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30'
                  >
                    <td className='px-4 py-4 sm:px-5'>
                      <div className='flex items-center gap-3'>
                        <Avatar className='size-9 shrink-0 rounded-md border border-border/60 bg-background/40'>
                          <AvatarFallback
                            className={cn(
                              'rounded-md font-mono text-[10px] tracking-wider',
                              user.is_active
                                ? 'bg-signal/15 text-signal'
                                : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {getDisplayNameInitials(user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='min-w-0 flex-1 space-y-0.5'>
                          <div className='flex items-center gap-2'>
                            <span
                              className={cn(
                                'truncate text-sm',
                                user.is_active
                                  ? 'text-foreground'
                                  : 'text-muted-foreground line-through decoration-muted-foreground/40',
                              )}
                            >
                              {user.email}
                            </span>
                            <span className='hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60 sm:inline'>
                              #{String(i + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <div className='flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:hidden'>
                            <span
                              className={cn(
                                user.is_active ? 'text-foreground' : 'text-muted-foreground',
                              )}
                            >
                              {user.is_active ? 'activo' : 'inactivo'}
                            </span>
                            <span className='text-muted-foreground/40'>·</span>
                            <span>{user.is_admin ? 'admin' : 'usuario'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4 sm:px-5'>
                      <button
                        type='button'
                        onClick={() => toggleFlag(user, 'is_admin')}
                        className='inline-flex items-center gap-2 rounded-md border border-border/60 bg-background/40 px-2.5 py-1.5 transition-colors hover:border-signal/40'
                        aria-label={`Cambiar rol de ${user.email}`}
                      >
                        {user.is_admin ? (
                          <ShieldCheck className='size-3.5 text-signal' />
                        ) : (
                          <Shield className='size-3.5 text-muted-foreground' />
                        )}
                        <span
                          className={cn(
                            'font-mono text-[10px] uppercase tracking-[0.22em]',
                            user.is_admin ? 'text-signal' : 'text-muted-foreground',
                          )}
                        >
                          {user.is_admin ? 'admin' : 'usuario'}
                        </span>
                      </button>
                    </td>
                    <td className='hidden px-4 py-4 sm:table-cell sm:px-5'>
                      <div className='flex items-center gap-3'>
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => toggleFlag(user, 'is_active')}
                          className='data-[state=checked]:bg-signal'
                          aria-label={`Cambiar estado de ${user.email}`}
                        />
                        <span
                          className={cn(
                            'font-mono text-[10px] uppercase tracking-[0.22em]',
                            user.is_active
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {user.is_active ? 'activo' : 'inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className='hidden px-4 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground lg:table-cell lg:px-5'>
                      uid_{String(user.id).padStart(4, '0')}
                    </td>
                    <td className='px-4 py-4 text-right sm:px-5'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='size-8 text-muted-foreground hover:text-foreground'
                            aria-label='Acciones'
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='min-w-44 border-border/60'>
                          <DropdownMenuItem
                            onClick={() => openEdit(user)}
                            className='font-mono text-[11px] uppercase tracking-[0.2em]'
                          >
                            <Pencil />
                            editar cuenta
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setToDelete(user)}
                            variant='destructive'
                            className='font-mono text-[11px] uppercase tracking-[0.2em]'
                          >
                            <Trash2 />
                            eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && filtered.length > 0 && (
            <footer className='flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:px-5'>
              <SectionEyebrow tone='muted'>
                {filtered.length} de {stats.total}
              </SectionEyebrow>
              <span className='flex items-center gap-1.5'>
                <span className='inline-block size-1.5 rounded-full bg-signal signal-dot' />
                cache sincronizado
              </span>
            </footer>
          )}
        </section>
      </Main>

      <UserDialog
        mode={dialog}
        onClose={closeDialog}
        onCreate={(values) =>
          new Promise<void>((resolve, reject) => {
            createUser.mutate(
              {
                email: values.email,
                password: values.password,
                is_active: true,
                is_admin: values.is_admin,
              },
              {
                onSuccess: () => {
                  toast.success('Usuario invitado')
                  closeDialog()
                  resolve()
                },
                onError: () => {
                  toast.error('No se pudo crear el usuario')
                  reject()
                },
              },
            )
          })
        }
        onUpdate={(values) =>
          new Promise<void>((resolve, reject) => {
            if (dialog.kind !== 'edit') {
              reject()
              return
            }
            const payload = {
              ...(values.email !== dialog.user.email ? { email: values.email } : {}),
              ...(values.password ? { password: values.password } : {}),
              is_admin: values.is_admin,
            }
            updateUser.mutate(
              { id: dialog.user.id, payload },
              {
                onSuccess: () => {
                  toast.success('Usuario actualizado')
                  closeDialog()
                  resolve()
                },
                onError: () => {
                  toast.error('No se pudo actualizar el usuario')
                  reject()
                },
              },
            )
          })
        }
        isSaving={createUser.isPending || updateUser.isPending}
      />

      <AlertDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent className='border-border/60'>
          <AlertDialogHeader>
            <AlertDialogTitle
              className='text-2xl tracking-tight'
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Eliminar <em className='italic text-signal'>cuenta</em>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && (
                <>
                  Vas a eliminar a{' '}
                  <span className='font-medium text-foreground'>
                    {toDelete.email}
                  </span>{' '}
                  y todas sus transcripciones. Esta accion no se puede
                  deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='font-mono text-[11px] uppercase tracking-[0.2em]'>
              cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteUser.isPending}
              className='bg-destructive text-white hover:bg-destructive/90'
            >
              {deleteUser.isPending ? (
                <Loader2 className='size-3.5 animate-spin' />
              ) : (
                <Trash2 className='size-3.5' />
              )}
              eliminar definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

type UserDialogProps = {
  mode: DialogMode
  onClose: () => void
  onCreate: (values: InviteFormValues) => Promise<void>
  onUpdate: (values: InviteFormValues) => Promise<void>
  isSaving: boolean
}

function UserDialog({ mode, onClose, onCreate, onUpdate, isSaving }: UserDialogProps) {
  const editing = mode.kind === 'edit' ? mode.user : null
  const isEdit = mode.kind === 'edit'

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: editing?.email ?? '',
      password: '',
      is_admin: editing?.is_admin ?? false,
    },
    values: editing
      ? { email: editing.email, password: '', is_admin: editing.is_admin }
      : undefined,
  })
  const isAdmin = useWatch({ control: form.control, name: 'is_admin' })

  async function onSubmit(values: InviteFormValues) {
    if (isEdit) {
      await onUpdate(values)
    } else {
      await onCreate(values)
    }
  }

  const open = mode.kind !== 'closed'

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          form.reset()
          onClose()
        }
      }}
    >
      <DialogContent className='border-border/60 sm:max-w-md'>
        <DialogHeader className='space-y-2 border-b border-border/60 pb-4'>
          <SectionEyebrow>{isEdit ? 'edit · account' : 'invite · account'}</SectionEyebrow>
          <DialogTitle
            className='text-2xl leading-tight tracking-tight'
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {isEdit ? (
              <>
                Editar <em className='italic text-signal'>cuenta</em>
              </>
            ) : (
              <>
                Invitar <em className='italic text-signal'>usuario</em>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza el correo, contrasena o rol del usuario.'
              : 'Define el correo, una contrasena inicial y si tendra permisos de administrador.'}
          </DialogDescription>
        </DialogHeader>

        <form
          id='user-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-5 py-2'
        >
          <div className='space-y-2'>
            <div className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
              <span>
                <span className='me-1.5 text-signal'>01</span>
                <span className='me-1.5 text-muted-foreground/60'>·</span>
                correo
              </span>
              <span>required</span>
            </div>
            <div className='group relative'>
              <Mail className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='email'
                placeholder='correo@ejemplo.com'
                {...form.register('email')}
                className='h-11 border-border/60 bg-background/40 ps-9 focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0'
              />
              <span className='pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-500 group-focus-within:w-full' />
            </div>
            {form.formState.errors.email && (
              <p className='font-mono text-[10px] uppercase tracking-wider text-destructive'>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
              <span>
                <span className='me-1.5 text-signal'>02</span>
                <span className='me-1.5 text-muted-foreground/60'>·</span>
                {isEdit ? 'nueva contrasena' : 'contrasena inicial'}
              </span>
              <span>{isEdit ? 'opcional' : 'min 6 chars'}</span>
            </div>
            <div className='group relative'>
              <KeyRound className='pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground' />
              <PasswordInput
                inputClassName='h-11 border-border/60 bg-background/40 ps-9 pr-10 focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0'
                placeholder={isEdit ? 'dejar vacia para mantener' : 'minimo 6 caracteres'}
                {...form.register('password')}
              />
              <span className='pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-500 group-focus-within:w-full' />
            </div>
            {form.formState.errors.password && (
              <p className='font-mono text-[10px] uppercase tracking-wider text-destructive'>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <label className='flex h-11 cursor-pointer items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 transition-colors hover:border-signal/40'>
            <Checkbox
              checked={isAdmin}
              onCheckedChange={(v) => form.setValue('is_admin', v === true)}
              className='border-signal/50 data-[state=checked]:border-signal data-[state=checked]:bg-signal data-[state=checked]:text-ink'
            />
            <span className='flex flex-1 items-center justify-between'>
              <span className='flex items-center gap-2 text-sm text-foreground'>
                <ShieldCheck className='size-3.5 text-signal' />
                Permisos de administrador
              </span>
              <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground'>
                {isAdmin ? 'admin' : 'usuario'}
              </span>
            </span>
          </label>
        </form>

        <DialogFooter className='border-t border-border/60 pt-4'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => {
              form.reset()
              onClose()
            }}
            className='font-mono text-[11px] uppercase tracking-[0.24em]'
          >
            cancelar
          </Button>
          <Button
            type='submit'
            form='user-form'
            disabled={isSaving}
            className='group h-11 overflow-hidden rounded-md bg-foreground px-5 text-background hover:bg-foreground/90'
          >
            <span className='absolute inset-y-0 left-0 w-1 bg-signal transition-all duration-500 group-hover:w-2' />
            <span className='relative flex w-full items-center gap-2'>
              {isSaving ? (
                <Loader2 className='size-3.5 animate-spin' />
              ) : (
                <ArrowRight className='size-3.5' />
              )}
              <span className='font-mono text-[11px] uppercase tracking-[0.24em]'>
                {isEdit ? 'guardar cambios' : 'crear cuenta'}
              </span>
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type EmptyStateProps = {
  title: string
  description: string
  action?: React.ReactNode
}

function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center gap-3 py-6 text-center'>
      <SignalChip variant='muted' pulse={false}>
        empty state
      </SignalChip>
      <div className='space-y-1'>
        <p
          className='text-lg tracking-tight'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {title}
        </p>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      {action}
    </div>
  )
}
