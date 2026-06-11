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
        <h1 className='text-2xl font-bold'>Not found</h1>
        <p className='text-muted-foreground'>Page not found.</p>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold'>Something went wrong</h1>
        <p className='text-muted-foreground'>
          Please refresh or try again later.
        </p>
      </div>
    </div>
  ),
})
