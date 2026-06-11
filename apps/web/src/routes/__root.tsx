import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster duration={5000} />
      </>
    )
  },
  notFoundComponent: () => (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>No encontrado</h1>
        <p className='text-muted-foreground'>Pagina no encontrada.</p>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Algo salio mal</h1>
        <p className='text-muted-foreground'>
          Refresca la pagina o intenta de nuevo mas tarde.
        </p>
      </div>
    </div>
  ),
})
