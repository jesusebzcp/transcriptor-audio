import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contrasena</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Iniciar sesion
        </Button>
      </form>
    </Form>
  )
}
