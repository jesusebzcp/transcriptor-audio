import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { BrandMark } from '../../components/brand-mark'

const formSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Ingresa tu correo.' : undefined),
  }),
  password: z.string().min(1, 'Ingresa tu contrasena.'),
})

type UserAuthFormProps = React.HTMLAttributes<HTMLFormElement>

export function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        new URLSearchParams({
          username: data.email,
          password: data.password,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      )
      const { access_token, user } = res.data
      auth.setAccessToken(access_token)
      auth.setUser({
        id: user.id,
        email: user.email,
        // eslint-disable-next-line react-hooks/purity
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      })
      toast.success(`Bienvenido, ${user.email}!`)
      navigate({ to: '/', replace: true })
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.status === 401
          ? 'Correo o contrasena incorrectos'
          : 'No se pudo iniciar sesion'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between lg:hidden'>
        <BrandMark />
      </div>

      <header className='space-y-3'>
        <div className='flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground'>
          <span className='inline-block h-px w-6 bg-signal' />
          paso 01 - autenticar
        </div>
        <h2
          className='text-[2.25rem] leading-[1.05] tracking-[-0.02em] text-foreground'
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Iniciar <em className='italic text-signal'>sesion</em>
        </h2>
        <p className='max-w-sm text-sm leading-relaxed text-muted-foreground'>
          Ingresa las credenciales configuradas en el entorno del servidor
          para abrir la consola de transcripcion.
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('flex flex-col gap-5', className)}
          noValidate
          {...props}
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <FormLabel className='font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
                  <span className='text-signal'>01</span> · correo electronico
                </FormLabel>
                <FormControl>
                  <div className='group relative'>
                    <Input
                      autoComplete='email'
                      placeholder='tu@correo.com'
                      className='h-12 rounded-md border-border/60 bg-transparent px-3 text-base shadow-none transition-colors focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[0.95rem]'
                      {...field}
                    />
                    <span className='pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-500 group-focus-within:w-full' />
                  </div>
                </FormControl>
                <FormMessage className='font-mono text-[10px] uppercase tracking-wider' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground'>
                    <span className='text-signal'>02</span> · contrasena
                  </FormLabel>
                  <span className='font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60'>
                    requerido
                  </span>
                </div>
                <FormControl>
                  <div className='group relative'>
                    <PasswordInput
                      autoComplete='current-password'
                      placeholder='••••••••••'
                      className='relative rounded-md'
                      inputClassName='h-12 rounded-md border-border/60 bg-transparent px-3 pr-10 text-base shadow-none transition-colors focus-visible:border-signal focus-visible:ring-0 focus-visible:ring-offset-0 md:text-[0.95rem]'
                      {...field}
                    />
                    <span className='pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-signal transition-all duration-500 group-focus-within:w-full' />
                  </div>
                </FormControl>
                <FormMessage className='font-mono text-[10px] uppercase tracking-wider' />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={isLoading}
            className='group relative h-12 mt-2 overflow-hidden rounded-md bg-foreground text-background transition-all hover:bg-foreground/90'
          >
            <span className='absolute inset-y-0 left-0 w-1 bg-signal transition-all duration-500 group-hover:w-2' />
            <span className='relative flex w-full items-center justify-between px-5'>
              <span className='font-mono text-[11px] uppercase tracking-[0.28em]'>
                {isLoading ? 'autenticando' : 'entrar a la consola'}
              </span>
              <span className='flex items-center gap-2'>
                {isLoading ? (
                  <Loader2 className='size-4 animate-spin' />
                ) : (
                  <ArrowRight className='size-4 transition-transform duration-300 group-hover:translate-x-1' />
                )}
              </span>
            </span>
          </Button>
        </form>
      </Form>

      <div className='flex flex-col gap-3 border-t border-border/60 pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80'>
        <div className='flex items-center justify-between'>
          <span className='flex items-center gap-1.5'>
            <ShieldCheck className='size-3 text-signal' />
            argon2 · jwt hs256
          </span>
          <span className='flex items-center gap-1.5'>
            <Sparkles className='size-3 text-signal' />
            faster-whisper listo
          </span>
        </div>
        <p className='text-muted-foreground/60'>
          Las credenciales se validan contra las variables
          <span className='mx-1 text-foreground/80'>AUTH_EMAILS</span>
          y
          <span className='mx-1 text-foreground/80'>AUTH_PASSWORD_HASH_VALUE</span>
          del servidor.
        </p>
      </div>
    </div>
  )
}
